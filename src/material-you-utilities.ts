import packageInfo from '../package.json';
import { MaterialYouPanel } from './classes/material-you-panel';

import { logStyles } from './models/constants/colors';
import {
	DEFAULT_BASE_COLOR_INPUT,
	DEFAULT_CONTRAST_LEVEL_INPUT,
	DEFAULT_SCHEME_NAME_INPUT,
} from './models/constants/inputs';
import { getAsync, querySelectorAsync } from './utils/async';
import { setTheme, setThemeAll } from './utils/colors';
import { getHomeAssistantMainAsync } from './utils/common';
import { setStyles } from './utils/styles';

async function main() {
	// Set styles on main window custom elements
	// Do this before anything else because it's time sensitive
	setStyles(window);

	console.info(
		`%c Material You Theme Utilities v${packageInfo.version} `,
		logStyles(),
	);

	// Apply colors and styles on iframe when it's added
	const haMain = await getHomeAssistantMainAsync();
	const observer = new MutationObserver(async (mutations) => {
		for (const mutation of mutations) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.nodeName == 'IFRAME') {
					const iframe = (await querySelectorAsync(
						haMain.shadowRoot as ShadowRoot,
						'iframe',
					)) as HTMLIFrameElement;
					const contentWindow = await getAsync(
						iframe,
						'contentWindow',
					);
					setStyles(contentWindow);

					const document = await getAsync(contentWindow, 'document');
					const body = await querySelectorAsync(document, 'body');
					setTheme(body);
				}
			}
		}
	});
	observer.observe(haMain.shadowRoot as ShadowRoot, {
		subtree: true,
		childList: true,
	});

	// Set user theme colors
	const html = await querySelectorAsync(document, 'html');
	setTheme(html);

	if (haMain.hass.user?.is_admin) {
		// Inputs for user theme color triggers
		const userId = haMain.hass.user?.id;
		const colorInputUserId = `${DEFAULT_BASE_COLOR_INPUT}_${userId}`;
		const schemeInputUserId = `${DEFAULT_SCHEME_NAME_INPUT}_${userId}`;
		const contrastInputUserId = `${DEFAULT_CONTRAST_LEVEL_INPUT}_${userId}`;

		// Trigger user theme color on input change
		haMain.hass.connection.subscribeMessage(
			() => setThemeAll(),
			{
				type: 'subscribe_trigger',
				trigger: {
					platform: 'state',
					entity_id: [
						DEFAULT_BASE_COLOR_INPUT,
						DEFAULT_SCHEME_NAME_INPUT,
						DEFAULT_CONTRAST_LEVEL_INPUT,
						colorInputUserId,
						schemeInputUserId,
						contrastInputUserId,
					].filter((entityId) => haMain.hass.states[entityId]),
				},
			},
			{ resubscribe: true },
		);

		// Trigger user theme color on theme changed event
		haMain.hass.connection.subscribeEvents(
			() => setThemeAll(),
			'themes_updated',
		);

		// Trigger user theme color on set theme service call
		haMain.hass.connection.subscribeEvents((e: Record<string, any>) => {
			if (e?.data?.service == 'set_theme') {
				setTimeout(() => setThemeAll(), 1000);
			}
		}, 'call_service');
	} else {
		// Trigger on configuration UI fired event
		window.addEventListener('material-you-update', () => setThemeAll());
	}
}

main();

customElements.define('material-you-panel', MaterialYouPanel);
