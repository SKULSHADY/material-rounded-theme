import { HomeAssistant } from '../models/interfaces';

/**
 * Show a toast
 * @param {Node} node node to fire the event on
 * @param {string} message message to display
 */
export function showToast(node: Node, message: string) {
	const event = new Event('hass-notification', {
		bubbles: true,
		composed: true,
	});
	event.detail = {
		message,
	};
	node.dispatchEvent(event);
}

/**
 * Create an input entity
 * @param {HomeAssistant} hass Home Assistant HASS object
 * @param {"text" | "select" | "number"} type Input element type to create
 * @param {Record<string, any>} config Input helper init config
 * @returns {Promise<Record<string, any>>}  Input helper init config, with default values for fields not provided
 */
export async function createInput(
	hass: HomeAssistant,
	type: 'text' | 'select' | 'number',
	config: Record<string, any>,
): Promise<Record<string, any>> {
	return hass.callWS({
		type: `input_${type}/create`,
		...config,
	});
}

/**
 * Update an input entity
 * @param {HomeAssistant} hass Home Assistant HASS object
 * @param {"text" | "select" | "number"} type Input element type to create
 * @param {string} id Element ID, not including domain
 * @returns {Promise<Record<string, any>>}  Input helper update config
 * @returns
 */
export async function updateInput(
	hass: HomeAssistant,
	type: 'text' | 'select' | 'number',
	id: string,
	config: Record<string, any>,
): Promise<Record<string, any>> {
	return hass.callWS({
		type: `input_${type}/update`,
		[`input_${type}_id`]: id,
		...config,
	});
}

/**
 * Delete an input entity
 * @param {HomeAssistant} hass Home Assistant HASS object
 * @param {"text" | "select" | "number"} type Input element type to create
 * @param {string} id Element ID, not including domain
 */
export async function deleteInput(
	hass: HomeAssistant,
	type: 'text' | 'select' | 'number',
	id: string,
) {
	hass.callWS({
		type: `input_${type}/delete`,
		[`input_${type}_id`]: id,
	});
}
