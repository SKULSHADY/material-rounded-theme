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
	DEFAULT_BASE_COLOR_INPUT,
	DEFAULT_CONTRAST_LEVEL,
	DEFAULT_CONTRAST_LEVEL_INPUT,
	DEFAULT_SCHEME_NAME_INPUT,
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

/* Generate and set theme colors based on user defined inputs */
export async function setTheme() {
	const hass = (document.querySelector('home-assistant') as HassElement).hass;
	{
		try {
			// Setup inputs
			const userId = hass.user?.id;
			const colorInputUserId = `${DEFAULT_BASE_COLOR_INPUT}_${userId}`;
			const schemeInputUserId = `${DEFAULT_SCHEME_NAME_INPUT}_${userId}`;
			const contrastInputUserId = `${DEFAULT_CONTRAST_LEVEL_INPUT}_${userId}`;

			const html = await querySelectorAsync(document, 'html');

			const themeName = hass?.themes?.theme ?? '';
			if (themeName.includes('Material You')) {
				let baseColor = (
					hass.states[colorInputUserId]?.state ||
					hass.states[DEFAULT_BASE_COLOR_INPUT]?.state ||
					''
				).trim();

				const schemeName = (
					hass.states[schemeInputUserId]?.state ||
					hass.states[DEFAULT_SCHEME_NAME_INPUT]?.state ||
					''
				).trim();

				let contrastLevel: number = DEFAULT_CONTRAST_LEVEL;
				for (const value of [
					hass.states[contrastInputUserId]?.state,
					hass.states[DEFAULT_CONTRAST_LEVEL_INPUT]?.state,
				]) {
					const parsed = parseFloat(value);
					if (!isNaN(parsed)) {
						contrastLevel = Math.max(Math.min(parsed, 1), -1);
						break;
					}
				}

				// Only update if one of the inputs is set
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
						`%c Material design system colors updated using base color ${baseColor}, scheme ${schemeInfo.label}, and contrast level ${contrastLevel}. `,
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
