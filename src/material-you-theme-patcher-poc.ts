/**
 * Material Design 3 Style Patcher
 * Monkey patches the firstUpdated lifecycle method of certain Home Assistant components to inject custom styles.
 */

import { html } from 'lit';

import haFab from './css/ha-fab.css';
import haSidebar from './css/ha-sidebar.css';
import haSlider from './css/ha-slider.css';
import haSwitch from './css/ha-switch.css';
import haTabs from './css/ha-tabs.css';
import haUserBadge from './css/ha-user-badge.css';
import huiEntitiesCard from './css/hui-entities-card.css';
import huiRoot from './css/hui-root.css';
import huiViewVisibilityEditor from './css/hui-view-visibility-editor.css';

import { HassElement } from './models/interfaces';
import { getAsync } from './models/utils';

let ha = document.querySelector('home-assistant') as HassElement;
let theme = '';

const elements: Record<string, string> = {
	'paper-tabs': haTabs,
	'ha-fab': haFab,
	'ha-switch': haSwitch,
	'ha-sidebar': haSidebar,
	'ha-slider': haSlider,
	'ha-tabs': haTabs,
	'ha-user-badge': haUserBadge,
	'hui-entities-card': huiEntitiesCard,
	'hui-root': huiRoot,
	'hui-view-visibility-editor': huiViewVisibilityEditor,
};

const optional = ['ha-fab'];

function checkTheme() {
	if (!theme) {
		ha = document.querySelector('home-assistant') as HassElement;
		theme = ha.hass?.themes?.theme;
	}
}

async function applyMaterialStyles(element: HassElement) {
	checkTheme();

	const shadowRoot = await getAsync(element, 'shadowRoot');
	if (
		!shadowRoot.querySelector('#material-you') &&
		theme.includes('Material You')
	) {
		const style = document.createElement('style');
		style.id = 'material-you';
		style.textContent = elements[element.nodeName.toLowerCase()];
		shadowRoot.appendChild(style);
	}
}

async function main() {
	ha.style.setProperty('display', 'none');

	const promises: Promise<unknown>[] = [];
	const define = window.CustomElementRegistry.prototype.define;
	window.CustomElementRegistry.prototype.define = function (
		name,
		constructor,
		options,
	) {
		const promise = new Promise((resolve) => {
			if (elements[name]) {
				// Add styles on render
				checkTheme();

				const render = constructor.prototype.render;
				constructor.prototype.render = function () {
					return html`
						${render.call(this)}
						${theme.includes('Material You')
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
				const connectedCallback =
					constructor.prototype.connectedCallback;
				constructor.prototype.connectedCallback = function () {
					applyMaterialStyles(this);
					connectedCallback.call(this);
				};
			}

			resolve(true);
		});

		if (!optional.includes(elements[name])) {
			promises.push(promise);
		}

		return define.call(this, name, constructor, options);
	};

	Promise.all(promises).then(() => {
		ha.style.removeProperty('display');
	});
}

main();
