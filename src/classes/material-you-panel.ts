import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import packageInfo from '../../package.json';
import {
	DEFAULT_BASE_COLOR,
	DEFAULT_BASE_COLOR_INPUT,
	DEFAULT_BASE_COLOR_SENSOR,
	DEFAULT_CONTRAST_LEVEL,
	DEFAULT_CONTRAST_LEVEL_INPUT,
	DEFAULT_CONTRAST_LEVEL_SENSOR,
	DEFAULT_SCHEME_NAME,
	DEFAULT_SCHEME_NAME_INPUT,
	DEFAULT_SCHEME_NAME_SENSOR,
	schemes,
} from '../models/constants/colors';
import { HomeAssistant } from '../models/interfaces';
import { IUserPanelSettings } from '../models/interfaces/Panel';

import {
	argbFromHex,
	argbFromRgb,
	blueFromArgb,
	greenFromArgb,
	hexFromArgb,
	redFromArgb,
} from '@material/material-color-utilities';

export class MaterialYouPanel extends LitElement {
	@property() hass!: HomeAssistant;
	@property() narrow!: boolean;
	@property() route!: object;
	@property() panel!: object;

	currentUserSettings!: IUserPanelSettings;
	globalSettings!: IUserPanelSettings;
	otherUserSettings: Record<string, IUserPanelSettings> = {};

	getConfig(userId: string) {
		let config: IUserPanelSettings;
		if (userId) {
			if (userId == this.hass.user?.id) {
				config = this.currentUserSettings;
			} else {
				config = this.otherUserSettings[userId];
			}
		} else {
			config = this.globalSettings;
		}
		return config;
	}

	async handleSelectorChange(e: CustomEvent) {
		const userId = (e.target as HTMLElement).getAttribute('user-id');
		const key = (e.target as HTMLElement).getAttribute('key');
		let value = e.detail.value ?? '';

		let entityBase = '';
		switch (key) {
			case 'base_color':
				entityBase = DEFAULT_BASE_COLOR_INPUT;
				value = hexFromArgb(argbFromRgb(value[0], value[1], value[2]));
				break;
			case 'scheme':
				entityBase = DEFAULT_SCHEME_NAME_INPUT;
				break;
			case 'contrast':
				entityBase = DEFAULT_CONTRAST_LEVEL_INPUT;
				break;
			default:
				break;
		}

		await this.hass.callService('input_text', 'set_value', {
			value,
			entity_id: `${entityBase}${userId ? `_${userId}` : ''}`,
		});
		this.requestUpdate();
	}

	buildSelector(
		label: string,
		key: 'base_color' | 'scheme' | 'contrast',
		userId: string,
		selector: object,
		placeholder?: string | number | boolean | object,
	) {
		const config = this.getConfig(userId);
		let value: string | number | number[];
		switch (key) {
			case 'base_color':
				const argb = argbFromHex(config.settings[key] as string);
				value = [
					redFromArgb(argb),
					greenFromArgb(argb),
					blueFromArgb(argb),
				];
				break;
			case 'scheme':
			case 'contrast':
			default:
				value = config.settings[key];
				break;
		}

		return html`<ha-selector
			.hass=${this.hass}
			.name="${label}"
			.selector=${selector}
			.value=${value ?? placeholder}
			.label="${label}"
			.placeholder=${placeholder}
			.required=${false}
			user-id="${userId}"
			key="${key}"
			@value-changed=${this.handleSelectorChange}
		></ha-selector>`;
	}

	async handleClearButton(e: MouseEvent) {
		const userId = (e.target as HTMLElement).getAttribute('user-id');
		const key = (e.target as HTMLElement).getAttribute('key');

		let entityBase = '';
		switch (key) {
			case 'base_color':
				entityBase = DEFAULT_BASE_COLOR_INPUT;
				break;
			case 'scheme':
				entityBase = DEFAULT_SCHEME_NAME_INPUT;
				break;
			case 'contrast':
				entityBase = DEFAULT_CONTRAST_LEVEL_INPUT;
				break;
			default:
				break;
		}

		await this.hass.callService('input_text', 'set_value', {
			value: '',
			entity_id: `${entityBase}${userId ? `_${userId}` : ''}`,
		});
		this.requestUpdate();
	}

	buildClearButton(key: string, userId?: string) {
		return html`
			<div class="clear button">
				<ha-icon
					@click=${this.handleClearButton}
					user-id="${userId}"
					key="${key}"
					.icon="${'mdi:close'}"
				></ha-icon>
			</div>
		`;
	}

	buildSettingsDatum(userId?: string) {
		let contrast: number = DEFAULT_CONTRAST_LEVEL;
		for (const value of [
			this.hass.states[
				`${DEFAULT_CONTRAST_LEVEL_SENSOR}${userId ? `_${userId}` : ''}`
			]?.state,
			this.hass.states[DEFAULT_CONTRAST_LEVEL_SENSOR]?.state,
		]) {
			const parsed = parseFloat(value);
			if (!isNaN(parsed)) {
				contrast = Math.max(Math.min(parsed, 1), -1);
				break;
			}
		}
		return {
			base_color:
				this.hass.states[
					`${DEFAULT_BASE_COLOR_SENSOR}${userId ? `_${userId}` : ''}`
				]?.state ||
				this.hass.states[DEFAULT_BASE_COLOR_SENSOR]?.state ||
				DEFAULT_BASE_COLOR,
			scheme:
				this.hass.states[
					`${DEFAULT_SCHEME_NAME_SENSOR}${userId ? `_${userId}` : ''}`
				]?.state ||
				this.hass.states[DEFAULT_SCHEME_NAME_SENSOR]?.state ||
				DEFAULT_SCHEME_NAME,
			contrast,
		};
	}

	buildSettingsData() {
		// People information
		const people = Object.keys(this.hass.states).filter((entity) =>
			entity.startsWith('person.'),
		);

		// Current user
		const currentUserId = this.hass.user?.id ?? '';
		this.currentUserSettings = {
			stateObj:
				this.hass.states[
					people.filter(
						(person) =>
							this.hass.states[person].attributes.user_id ==
							currentUserId,
					)[0]
				],
			settings: this.buildSettingsDatum(currentUserId),
		};

		// If admin, add global and all user settings
		if (this.hass.user?.is_admin) {
			this.globalSettings = { settings: this.buildSettingsDatum() };

			for (const person of people) {
				const userId = this.hass.states[person].attributes.user_id;
				if (userId != currentUserId) {
					this.otherUserSettings[userId] = {
						stateObj: this.hass.states[person],
						settings: this.buildSettingsDatum(userId),
					};
				}
			}
		}
	}

	buildHeader() {
		return html`<div class="header">
			<ha-menu-button
				slot="navigationIcon"
				.hass=${this.hass}
				.narrow=${this.narrow}
			></ha-menu-button>
			<div class="title">Material You Theme</div>
			<div class="secondary">v${packageInfo.version}</div>
		</div>`;
	}

	buildSettingsCard(settings: IUserPanelSettings) {
		const userId = settings.stateObj?.attributes.user_id;

		const colorInput = `${DEFAULT_BASE_COLOR_INPUT}${userId ? `_${userId}` : ''}`;
		const schemeInput = `${DEFAULT_SCHEME_NAME_INPUT}${userId ? `_${userId}` : ''}`;
		const contrastInput = `${DEFAULT_CONTRAST_LEVEL_INPUT}${userId ? `_${userId}` : ''}`;
		const errorMessageStart =
			'This helper has not been setup! Navigate to Settings, Devices & services, Helpers, click Create Helper, click Text, name it "Material You ';
		const errorMessageEnd = '" and then navigate back to this page.';

		let title = 'Global';
		if (settings.stateObj) {
			title = settings.stateObj.attributes.friendly_name ?? '';
		}

		return html`
			<ha-card .hass=${this.hass} .header=${title}>
				${settings.stateObj
					? html`<div class="secondary subtitle">ID: ${userId}</div>`
					: ''}
				<div class="card-content">
					<div class="base-color">
						${this.hass.states[colorInput]
							? html`${this.buildSelector(
										'Base Color',
										'base_color',
										userId,
										{
											color_rgb: {},
										},
										settings.settings.base_color ||
											DEFAULT_BASE_COLOR,
									)}
									<div class="label">
										${settings.settings.base_color ||
										DEFAULT_BASE_COLOR}
									</div>
									${this.buildClearButton(
										'base_color',
										userId,
									)}`
							: this.buildAlertBox(
									`${errorMessageStart}Base Color${userId ? ` ${userId}` : ''}${errorMessageEnd}`,
									'warning',
								)}
					</div>
					<div class="scheme">
						${this.hass.states[schemeInput]
							? this.buildSelector(
									'Scheme Name',
									'scheme',
									userId,
									{
										select: {
											mode: 'dropdown',
											options: schemes,
										},
									},
									settings.settings.scheme ||
										DEFAULT_SCHEME_NAME,
								)
							: this.buildAlertBox(
									`${errorMessageStart}Scheme${userId ? ` ${userId}` : ''}${errorMessageEnd}`,
									'warning',
								)}
					</div>
					<div class="contrast">
						${this.hass.states[contrastInput]
							? this.buildSelector(
									'Contrast Level',
									'contrast',
									userId,
									{
										number: {
											min: -1,
											max: 1,
											step: 0.1,
											mode: 'slider',
											slider_ticks: true,
										},
									},
									isNaN(
										parseFloat(
											String(settings.settings.contrast),
										),
									)
										? DEFAULT_CONTRAST_LEVEL
										: settings.settings.contrast,
								)
							: this.buildAlertBox(
									`${errorMessageStart}Contrast${userId ? ` ${userId}` : ''}${errorMessageEnd}`,
									'warning',
								)}
					</div>
				</div>
			</ha-card>
		`;
	}

	buildAlertBox(
		title: string,
		type: 'info' | 'warning' | 'error' | 'success' = 'info',
	) {
		return html`<ha-alert
			.title="${title}"
			.alertType="${type}"
		></ha-alert>`;
	}

	render() {
		this.buildSettingsData();
		return html`
			${this.buildHeader()}
			<div class="content">
				${this.buildSettingsCard(this.currentUserSettings)}
				${this.hass.user?.is_admin
					? html`
							${this.buildSettingsCard(this.globalSettings)}
							${Object.keys(this.otherUserSettings).map(
								(userId) =>
									this.buildSettingsCard(
										this.otherUserSettings[userId],
									),
							)}
						`
					: ''}
			</div>
		`;
	}

	static get styles() {
		return css`
			:host {
				font-family: var(--font-family);
			}

			.header {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 0 12px;
				height: 64px;
			}
			.title {
				font-size: 20px;
				lint-height: var(--mdc-typography-headline6-line-height, 2rem);
				font-weight: var(--mdc-typography-headline6-font-weight, 500);
				letter-spacing: var(
					--mdc-typography-headline6-letter-spacing,
					0.0125em
				);
				text-transform: var(
					--mdc-typography-headline6-text-transform,
					inherit
				);
				white-space: nowrap;
			}
			.secondary {
				color: var(--secondary-text-color);
				font-size: 14px;
				font-weight: 400;
			}

			.content {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 24px;
			}
			ha-card {
				width: min(600px, 100%);
			}
			.card-content {
				display: flex;
				flex-direction: column;
				gap: 24px;
				padding: 0 16px 16px;
			}
			.subtitle {
				margin-top: -24px;
				padding: 0 16px 16px;
			}

			ha-selector {
				width: 100%;
			}
			.base-color {
				display: flex;
				flex-direction: row;
				align-center: center;
				border-top-left-radius: var(--mdc-shape-small, 4px);
				border-top-right-radius: var(--mdc-shape-small, 4px);
			}
			.base-color:not(:has(ha-alert)) {
				background-color: var(--mdc-select-fill-color);
			}
			.base-color,
			.scheme,
			.contrast {
				margin: 0 4px;
			}
			.label {
				padding: 20px;
				margin: auto;
			}

			.card-actions {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
			}
			.button {
				display: flex;
				justify-content: center;
				align-items: center;
				color: var(--color);
				cursor: pointer;
			}
			.button::after {
				content: '';
				position: absolute;
				height: var(--button-size);
				border-radius: var(--button-size);
				background-color: var(--color);
				pointer-events: none;
				opacity: 0;
			}
			@media (hover: hover) {
				.button:hover::after {
					opacity: var(--mdc-ripple-hover-opacity, 0.04);
				}
			}
			.button:active::after {
				opacity: var(--mdc-ripple-focus-opacity, 0.12);
			}
			.clear {
				height: var(--button-size);
				width: var(--button-size);
				padding: 10px;
				--color: var(--secondary-text-color);
				--button-size: 36px;
				--mdc-icon-size: 20px;
			}
			.clear::after {
				width: var(--button-size);
			}
			.setup {
				margin: 0 8px;
				height: var(--button-size);
				width: 100px;
				border-radius: var(--button-size);
				--button-size: 36px;
				--color: var(--primary-color);
			}
			.setup::after {
				width: 120px;
			}
		`;
	}
}
