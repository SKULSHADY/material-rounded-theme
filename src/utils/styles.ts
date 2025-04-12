import { html } from 'lit';
import { elements } from '../css';
import {
	DEFAULT_STYLES,
	DEFAULT_STYLES_INPUT,
} from '../models/constants/inputs';
import { HassElement } from '../models/interfaces';
import { getAsync } from './async';

// Theme check variables
let theme = '';
let shouldSetStyles = true;

/**
 * Check if theme is a "Material You" variant and set should set styles flag
 */
export function checkTheme() {
	if (!theme) {
		const ha = document.querySelector('home-assistant') as HassElement;
		theme = ha.hass?.themes?.theme;
		shouldSetStyles =
			theme?.includes('Material You') &&
			(ha.hass.states[`${DEFAULT_STYLES_INPUT}_${ha.hass.user?.id}`]
				?.state ??
				ha.hass.states[DEFAULT_STYLES_INPUT]?.state ??
				DEFAULT_STYLES) == 'on';
	}
}

/**
 * Convert imported styles to string and add !important to all styles
 * @param {string} styles CSS styles imported from file
 * @returns {string} styles converted to string and all set to !important
 */
export function loadStyles(styles: string): string {
	return styles.toString().replace(/;/g, ' !important;');
}

/**
 * Apply styles to custom elements
 * @param {HassElement} element
 */
export async function applyStyles(element: HassElement) {
	checkTheme();

	// Add styles, removing previously added Material You styles
	const shadowRoot = (await getAsync(element, 'shadowRoot')) as ShadowRoot;
	if (shouldSetStyles) {
		const style = document.createElement('style');
		style.id = 'material-you';
		style.textContent = loadStyles(
			elements[element.nodeName.toLowerCase()],
		);
		for (const node of shadowRoot.querySelectorAll('#material-you')) {
			shadowRoot.removeChild(node);
		}
		shadowRoot.appendChild(style);
	}
}

/**
 * Modify targets custom element registry define function to intercept constructors to use custom styles
 * Style are redundantly added in multiple places to ensure speed and consistency
 * @param {typeof globalThis} target
 */
export async function setStyles(target: typeof globalThis) {
	const define = target.CustomElementRegistry.prototype.define;
	target.CustomElementRegistry.prototype.define = function (
		name,
		constructor,
		options,
	) {
		if (elements[name]) {
			checkTheme();

			// Add styles on render
			// Most efficient but doesn't always work
			const render = constructor.prototype.render;
			constructor.prototype.render = function () {
				return html`
					${render.call(this)}
					${shouldSetStyles
						? html`<style id="material-you">
								${loadStyles(elements[name])}
							</style>`
						: ''}
				`;
			};

			// Add styles on firstUpdated
			// Second most efficient, doesn't always work
			const firstUpdated = constructor.prototype.firstUpdated;
			if (firstUpdated) {
				constructor.prototype.firstUpdated = function () {
					applyStyles(this);
					firstUpdated.call(this);
				};
			}

			// Add styles on connectedCallback
			// Not as efficient but always works
			const connectedCallback = constructor.prototype.connectedCallback;
			constructor.prototype.connectedCallback = function () {
				applyStyles(this);
				connectedCallback.call(this);
			};
		}

		return define.call(this, name, constructor, options);
	};
}
