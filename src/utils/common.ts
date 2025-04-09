import { schemes } from '../models/constants/colors';
import { HassElement } from '../models/interfaces';
import { IScheme } from '../models/interfaces/Scheme';
import { getAsync, querySelectorAsync } from './async';

/**
 * Get scheme class and name using user input name
 * @param {string} name user provided scheme name
 * @returns {IScheme} Scheme name and class
 */
export function getSchemeInfo(name: string = 'Tonal Spot'): IScheme {
	name = name?.toLowerCase()?.replace(/ |-|_/g, '')?.trim();
	return schemes[name] ?? schemes['tonalspot'];
}

/**
 * Get theme color token
 * @param {string} color Material Dynamic Color key
 * @returns {string} Material Dynamic Color token
 */
export function getToken(color: string): string {
	return color.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Get targets to apply or remove theme colors to/from
 * @returns {HTMLElement[]} HTML Elements to apply/remove theme to/from
 */
export async function getTargets(): Promise<HTMLElement[]> {
	const targets: HTMLElement[] = [
		(await querySelectorAsync(document, 'html')) as HTMLElement,
	];

	// Add-ons and HACS iframe
	const ha = await getHomeAssistantMainAsync();
	const iframe = ha.shadowRoot
		?.querySelector('iframe')
		?.contentWindow?.document?.querySelector('body');
	if (iframe) {
		targets.push(iframe);
	}
	return targets;
}

/**
 * Wait for home-assistant-main shadow-root to load, then return home-assistant-main
 * @returns {ShadowRoot} home-assistant-main element
 */
export async function getHomeAssistantMainAsync(): Promise<HassElement> {
	const ha = (await querySelectorAsync(
		await getAsync(
			await querySelectorAsync(document, 'home-assistant'),
			'shadowRoot',
		),
		'home-assistant-main',
	)) as HassElement;
	await getAsync(ha, 'shadowRoot');
	return ha;
}
