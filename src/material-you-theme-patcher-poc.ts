/*
 * Material Design 3 Style Patcher
 * Monkey patches the firstUpdated lifecycle method of certain Home Assistant components to inject custom styles.
 */

import { html } from 'lit';

import haAssistChip from './css/ha-assist-chip.css';
import haButton from './css/ha-button.css';
import haDialog from './css/ha-dialog.css';
import haEntityToggle from './css/ha-entity-toggle.css';
import haFab from './css/ha-fab.css';
import haSidebar from './css/ha-sidebar.css';
import haSlider from './css/ha-slider.css';
import haSwitch from './css/ha-switch.css';
import haTabs from './css/ha-tabs.css';
import haToast from './css/ha-toast.css';
import haUserBadge from './css/ha-user-badge.css';
import hassSubpage from './css/hass-subpage.css';
import huiEntitiesCard from './css/hui-entities-card.css';
import huiGridSection from './css/hui-grid-section.css';
import huiRoot from './css/hui-root.css';
import huiViewVisibilityEditor from './css/hui-view-visibility-editor.css';

import { HassElement } from './models/interfaces';
import { getAsync, querySelectorAsync } from './models/utils';

let ha = document.querySelector('home-assistant') as HassElement;
let theme = '';
let shouldSetStyles = true;

const elements: Record<string, string> = {
	'ha-assist-chip': haAssistChip,
	'ha-button': haButton,
	'mwc-button': haButton,
	'ha-dialog': haDialog,
	'ha-entity-toggle': haEntityToggle,
	'ha-fab': haFab,
	'ha-sidebar': haSidebar,
	'ha-slider': haSlider,
	'md-slider': haSlider,
	'ha-switch': haSwitch,
	'ha-tabs': haTabs,
	'paper-tabs': haTabs,
	'ha-toast': haToast,
	'ha-user-badge': haUserBadge,
	'hass-subpage': hassSubpage,
	'hass-tabs-subpage': hassSubpage,
	'hui-entities-card': huiEntitiesCard,
	'hui-grid-section': huiGridSection,
	'hui-root': huiRoot,
	'hui-view-visibility-editor': huiViewVisibilityEditor,
};

function checkTheme() {
	if (!theme) {
		ha = document.querySelector('home-assistant') as HassElement;
		theme = ha.hass?.themes?.theme;
		shouldSetStyles = theme?.includes('Material You');
	}
}

async function applyMaterialStyles(element: HassElement) {
	checkTheme();

	const shadowRoot = await getAsync(element, 'shadowRoot');
	if (!shadowRoot.querySelector('#material-you') && shouldSetStyles) {
		const style = document.createElement('style');
		style.id = 'material-you';
		style.textContent = elements[element.nodeName.toLowerCase()];
		shadowRoot.appendChild(style);
	}
}

async function setStyles(target: typeof globalThis) {
	const define = target.CustomElementRegistry.prototype.define;
	target.CustomElementRegistry.prototype.define = function (
		name,
		constructor,
		options,
	) {
		if (elements[name]) {
			// Add styles on render
			checkTheme();

			const render = constructor.prototype.render;
			constructor.prototype.render = function () {
				return html`
					${render.call(this)}
					${shouldSetStyles
						? html`<style id="material-you">
								${elements[name]}
							</style>`
						: ''}
				`;
			};

			// Add styles on firstUpdated
			const firstUpdated = constructor.prototype.firstUpdated;
			if (firstUpdated) {
				constructor.prototype.firstUpdated = function () {
					applyMaterialStyles(this);
					firstUpdated.call(this);
				};
			}

			// Add styles on connectedCallback
			const connectedCallback = constructor.prototype.connectedCallback;
			constructor.prototype.connectedCallback = function () {
				applyMaterialStyles(this);
				connectedCallback.call(this);
			};
		}

		return define.call(this, name, constructor, options);
	};
}

async function main() {
	await setStyles(window);

	// Trigger on iframe node added to home-assistant-main
	const haShadowRoot = await getAsync(ha, 'shadowRoot');
	const haMain = await querySelectorAsync(
		haShadowRoot,
		'home-assistant-main',
	);
	const haMainShadowRoot = await getAsync(haMain, 'shadowRoot');
	const observer = new MutationObserver(async (mutations) => {
		for (const mutation of mutations) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.nodeName == 'IFRAME') {
					const iframe = (await querySelectorAsync(
						haMainShadowRoot,
						'iframe',
					)) as HTMLIFrameElement;
					const contentWindow = await getAsync(
						iframe,
						'contentWindow',
					);
					await setStyles(contentWindow);
				}
			}
		}
	});
	observer.observe(haMainShadowRoot, {
		subtree: true,
		childList: true,
	});
}

main();
