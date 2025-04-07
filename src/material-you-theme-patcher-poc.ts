/**
 * Material Design 3 Style Patcher
 * Monkey patches the firstUpdated lifecycle method of certain Home Assistant components to inject custom styles.
 */

import { html } from 'lit';

import haCard from './css/ha-card.css';
import haFab from './css/ha-fab.css';
import haSidebar from './css/ha-sidebar.css';
import haSlider from './css/ha-slider.css';
import haSwitch from './css/ha-switch.css';
import haTabs from './css/ha-tabs.css';
import haUserBadge from './css/ha-user-badge.css';
import huiRoot from './css/hui-root.css';

import { getAsync } from './models/utils';

const ha = document.querySelector('home-assistant') as HTMLElement;
ha.style.setProperty('display', 'none');

const elements: Record<string, string> = {
	'paper-tabs': haTabs,
	'ha-card': haCard,
	'ha-fab': haFab,
	'ha-switch': haSwitch,
	'ha-sidebar': haSidebar,
	'ha-slider': haSlider,
	'ha-tabs': haTabs,
	'ha-user-badge': haUserBadge,
	'hui-root': huiRoot,
};

const optional = ['ha-fab'];
const promises: Promise<unknown>[] = [];

async function applyMaterialStyles(element: HTMLElement) {
	const shadowRoot = await getAsync(element, 'shadowRoot');
	if (!shadowRoot.querySelector('#material-you')) {
		const style = document.createElement('style');
		style.id = 'material-you';
		style.textContent = elements[element.nodeName.toLowerCase()];
		shadowRoot.appendChild(style);
	}
}

const define = window.CustomElementRegistry.prototype.define;
window.CustomElementRegistry.prototype.define = function (
	name,
	constructor,
	options,
) {
	const promise = new Promise((resolve) => {
		if (elements[name]) {
			// Add styles on render
			const render = constructor.prototype.render;
			constructor.prototype.render = function () {
				return html`
					${render.call(this)}
					<style id="material-you">
						${elements[name]}
					</style>
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
