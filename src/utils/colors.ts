import {
	argbFromHex,
	DynamicColor,
	Hct,
	hexFromArgb,
	MaterialDynamicColors,
} from '@material/material-color-utilities';

import {
	colors,
	DEFAULT_BASE_COLOR,
	DEFAULT_CONTRAST_LEVEL,
	logStyles,
} from '../models/constants/colors';
import { HassElement } from '../models/interfaces';
import { querySelectorAsync } from './async';
import { getSchemeInfo, getTargets, getToken } from './common';

/* Remove theme colors */
export async function unsetTheme() {
	const targets = await getTargets();
	for (const color of colors) {
		for (const target of targets) {
			const token = getToken(color);
			target?.style.removeProperty(`--md-sys-color-${token}-light`);
			target?.style.removeProperty(`--md-sys-color-${token}-dark`);
		}
	}
	console.info('%c Material design system colors removed. ', logStyles());
}

/* Generate and set theme colors based on user defined sensors */
export async function setTheme() {
	const hass = (document.querySelector('home-assistant') as HassElement).hass;
	{
		try {
			// Setup sensors
			const userId = hass.user?.id;

			// Color sensors
			const colorSensor = 'sensor.material_you_base_color';
			const colorSensorUserId = `${colorSensor}_${userId}`;

			// Scheme sensors
			const schemeSensor = 'sensor.material_you_scheme';
			const schemeSensorUserId = `${schemeSensor}_${userId}`;

			// Contrast sensors
			const contrastSensor = 'sensor.material_you_contrast';
			const contrastSensorUserId = `${contrastSensor}_${userId}`;

			const html = await querySelectorAsync(document, 'html');

			const themeName = hass?.themes?.theme ?? '';
			if (themeName.includes('Material You')) {
				let baseColor =
					hass.states[colorSensorUserId]?.state ||
					hass.states[colorSensor]?.state;

				const schemeName = (
					hass.states[schemeSensorUserId]?.state ||
					hass.states[schemeSensor]?.state ||
					''
				).trim();

				let contrastLevel: number = DEFAULT_CONTRAST_LEVEL;
				for (const value of [
					hass.states[contrastSensorUserId]?.state,
					hass.states[contrastSensor]?.state,
				]) {
					const parsed = parseFloat(value);
					if (!isNaN(parsed)) {
						contrastLevel = Math.max(Math.min(parsed, 1), -1);
						break;
					}
				}

				// Only update if one of the sensors detects something
				if (baseColor || schemeName || contrastLevel) {
					baseColor ||= DEFAULT_BASE_COLOR;
					const schemeInfo = getSchemeInfo(schemeName);
					const targets = await getTargets();

					for (const mode of ['light', 'dark']) {
						const scheme = new schemeInfo.class(
							Hct.fromInt(argbFromHex(baseColor)),
							mode == 'dark',
							contrastLevel,
						);

						for (const color of colors) {
							const hex = hexFromArgb(
								(
									MaterialDynamicColors[color] as DynamicColor
								).getArgb(scheme),
							);
							const token = getToken(color);
							for (const target of targets) {
								target.style.setProperty(
									`--md-sys-color-${token}-${mode}`,
									hex,
								);
							}
						}
					}

					// This explicit background color breaks color theme on some pages
					html?.style.removeProperty('background-color');

					const background = html.style.getPropertyValue(
						'--md-sys-color-primary-light',
					);
					const color = html.style.getPropertyValue(
						'--md-sys-color-on-primary-light',
					);
					console.info(
						`%c Material design system colors updated using base color ${baseColor}, scheme ${schemeInfo.name}, and contrast level ${contrastLevel}. `,
						logStyles(color, background),
					);
				} else {
					await unsetTheme();
				}
			}
		} catch (e) {
			console.error(e);
			await unsetTheme();
		}

		// Update companion app app and navigation bar colors
		const msg = { type: 'theme-update' };
		if (window.externalApp) {
			window.externalApp.externalBus(JSON.stringify(msg));
		} else if (window.webkit) {
			window.webkit.messageHandlers.externalBus.postMessage(msg);
		}
	}
}
