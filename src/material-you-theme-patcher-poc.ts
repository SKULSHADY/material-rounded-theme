/**
 * Material Design 3 Style Patcher
 * Monkey patches the firstUpdated lifecycle method of certain Home Assistant components to inject custom styles.
 */

import haFab from './css/ha-fab.css';
import haSidebar from './css/ha-sidebar.css';
import haSlider from './css/ha-slider.css';
import haSwitch from './css/ha-switch.css';

const elements: Record<string, string> = {
	'ha-switch': haSwitch.toString(),
	'ha-sidebar': haSidebar.toString(),
	'ha-slider': haSlider.toString(),
	'ha-fab': haFab.toString(),
};

for (const [element, styles] of Object.entries(elements)) {
	customElements.whenDefined(element).then((Constructor) => {
		const originalFirstUpdated = Constructor.prototype.firstUpdated;

		Constructor.prototype.firstUpdated = function () {
			originalFirstUpdated?.call(this);

			const style = document.createElement('style');
			style.textContent = styles;

			this.shadowRoot.appendChild(style);
		};
	});
}
