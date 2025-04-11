import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import packageInfo from '../../package.json';
import {
	DEFAULT_BASE_COLOR_HEX,
	DEFAULT_BASE_COLOR_ICON,
	DEFAULT_BASE_COLOR_INPUT,
	DEFAULT_BASE_COLOR_NAME,
	DEFAULT_BASE_COLOR_RGB,
	DEFAULT_CONTRAST_LEVEL,
	DEFAULT_CONTRAST_LEVEL_ICON,
	DEFAULT_CONTRAST_LEVEL_INPUT,
	DEFAULT_CONTRAST_LEVEL_NAME,
	DEFAULT_SCHEME_NAME,
	DEFAULT_SCHEME_NAME_ICON,
	DEFAULT_SCHEME_NAME_INPUT,
	DEFAULT_SCHEME_NAME_NAME,
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
import {
	createInput,
	deleteInput,
	showToast,
	updateInput,
} from '../utils/panel';

export class MaterialYouPanel extends LitElement {
	@property() hass!: HomeAssistant;
	@property() narrow!: boolean;
	@property() route!: object;
	@property() panel!: object;

	currentUserSettings!: IUserPanelSettings;
	globalSettings!: IUserPanelSettings;
	otherUserSettings: Record<string, IUserPanelSettings> = {};

	fireUpdateEvent() {
		if (!this.hass.user?.is_admin) {
			this.dispatchEvent(
				new Event('material-you-update', {
					bubbles: true,
					composed: true,
				}),
			);
		}
	}

	async handleDeleteHelpers(e: MouseEvent) {
		const userId = (e.target as HTMLElement).getAttribute('user-id');
		const idSuffix = userId ? `_${userId}` : '';

		let entityId = `${DEFAULT_BASE_COLOR_INPUT}${idSuffix}`;
		if (this.hass.states[entityId]) {
			await deleteInput(this.hass, 'text', entityId.split('.')[1]);
		}

		entityId = `${DEFAULT_SCHEME_NAME_INPUT}${idSuffix}`;
		if (this.hass.states[entityId]) {
			await deleteInput(this.hass, 'select', entityId.split('.')[1]);
		}

		entityId = `${DEFAULT_CONTRAST_LEVEL_INPUT}${idSuffix}`;
		if (this.hass.states[entityId]) {
			await deleteInput(this.hass, 'number', entityId.split('.')[1]);
		}

		let message = 'Global input entities cleared';
		if (userId) {
			let userName = '';
			if (userId == this.hass.user?.id) {
				userName = this.hass.user?.name ?? '';
			} else {
				userName =
					this.otherUserSettings[userId].stateObj?.attributes
						.friendly_name ?? '';
			}
			message = `Input entities cleared for ${userName}`;
		}
		showToast(this, message);
		this.fireUpdateEvent();
	}

	buildDeleteHelpersButton(userId?: string) {
		return html`
			<div
				class="delete button"
				user-id="${userId}"
				@click=${this.handleDeleteHelpers}
			>
				Delete Helpers
			</div>
		`;
	}

	async handleCreateHelpers(e: MouseEvent) {
		// User ID and name checks
		const userId = (e.target as HTMLElement).getAttribute('user-id');
		const idSuffix = userId ? `_${userId}` : '';
		let userName = '';
		if (userId) {
			if (this.hass.user?.id == userId) {
				userName =
					this.currentUserSettings.stateObj?.attributes
						.friendly_name ?? '';
			} else {
				userName =
					this.otherUserSettings[
						Object.keys(this.otherUserSettings).filter(
							(id) => userId == id,
						)[0]
					].stateObj?.attributes.friendly_name ?? '';
			}
			userName = ` ${userName}`;
		}

		// Base Color
		let entityId = `${DEFAULT_BASE_COLOR_INPUT}${idSuffix}`;
		if (!this.hass.states[entityId]) {
			const id = entityId.split('.')[1];
			const config = {
				icon: DEFAULT_BASE_COLOR_ICON,
				min: 0,
				max: 9,
			};
			await createInput(this.hass, 'text', {
				name: id,
				...config,
			});
			await updateInput(this.hass, 'text', id, {
				name: `${DEFAULT_BASE_COLOR_NAME}${userName}`,
				...config,
			});
			await this.hass.callService('input_text', 'set_value', {
				value: '',
				entity_id: entityId,
			});
		}

		// Scheme Name
		entityId = `${DEFAULT_SCHEME_NAME_INPUT}${idSuffix}`;
		if (!this.hass.states[entityId]) {
			const id = entityId.split('.')[1];
			const config = {
				icon: DEFAULT_SCHEME_NAME_ICON,
				options: [...schemes.map((scheme) => scheme.value), ' '],
			};
			await createInput(this.hass, 'select', {
				name: id,
				...config,
			});
			await updateInput(this.hass, 'select', id, {
				name: `${DEFAULT_SCHEME_NAME_NAME}${userName}`,
				...config,
			});
			await this.hass.callService('input_select', 'select_option', {
				option: ' ',
				entity_id: entityId,
			});
		}

		// Contrast Level
		entityId = `${DEFAULT_CONTRAST_LEVEL_INPUT}${idSuffix}`;
		if (!this.hass.states[entityId]) {
			const id = entityId.split('.')[1];
			const config = {
				icon: DEFAULT_CONTRAST_LEVEL_ICON,
				min: -1,
				max: 1,
				step: 0.1,
			};
			await createInput(this.hass, 'number', {
				name: id,
				...config,
			});
			await updateInput(this.hass, 'number', id, {
				name: `${DEFAULT_CONTRAST_LEVEL_NAME}${userName}`,
				...config,
			});
			await this.hass.callService('input_number', 'set_value', {
				value: 0,
				entity_id: entityId,
			});
		}

		let message = 'Global input entities created';
		if (userName) {
			message = `Input entities created for ${userName}`;
		}
		showToast(this, message);
	}

	buildCreateHelpersButton(userId?: string) {
		return html`
			<div
				class="create button"
				user-id="${userId}"
				@click=${this.handleCreateHelpers}
			>
				Create Helpers
			</div>
		`;
	}

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
		const field = (e.target as HTMLElement).getAttribute('field');
		let value = e.detail.value;

		let entityBase = '';
		let domain = '';
		let service = 'set_value';
		let key = 'value';
		switch (field) {
			case 'base_color':
				domain = 'input_text';
				entityBase = DEFAULT_BASE_COLOR_INPUT;
				value = hexFromArgb(argbFromRgb(value[0], value[1], value[2]));
				break;
			case 'scheme':
				domain = 'input_select';
				service = 'select_option';
				key = 'option';
				entityBase = DEFAULT_SCHEME_NAME_INPUT;
				value ||= ' ';
				break;
			case 'contrast':
				domain = 'input_number';
				entityBase = DEFAULT_CONTRAST_LEVEL_INPUT;
				value ||= 0;
				break;
			default:
				break;
		}

		await this.hass.callService(domain, service, {
			[key]: value,
			entity_id: `${entityBase}${userId ? `_${userId}` : ''}`,
		});
		this.fireUpdateEvent();
		this.requestUpdate();
	}

	buildSelector(
		label: string,
		field: 'base_color' | 'scheme' | 'contrast',
		userId: string,
		selector: object,
		placeholder?: string | number | boolean | object,
	) {
		const config = this.getConfig(userId);
		let value: string | number | number[];
		switch (field) {
			case 'base_color':
				try {
					const argb = argbFromHex(config.settings[field] as string);
					value = [
						redFromArgb(argb),
						greenFromArgb(argb),
						blueFromArgb(argb),
					];
				} catch (e) {
					console.error(e);
					value = DEFAULT_BASE_COLOR_RGB;
				}
				break;
			case 'scheme':
			case 'contrast':
			default:
				value = config.settings[field];
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
			field="${field}"
			@value-changed=${this.handleSelectorChange}
		></ha-selector>`;
	}

	async handleKeyDown(e: KeyboardEvent) {
		if (!e.repeat && ['Enter', ' '].includes(e.key)) {
			e.preventDefault();

			let handler: Function;
			const className = (e.target as HTMLElement).className
				.replace('button', '')
				.trim();
			switch (className) {
				case 'clear':
					handler = this.handleClearClick;
					break;
				case 'more-info':
				default:
					handler = this.handleMoreInfoClick;
					break;
			}

			handler(new window.MouseEvent('click', e), e.target as HTMLElement);
		}
	}

	async handleClearClick(e: MouseEvent, target?: HTMLElement) {
		const userId = ((e.target as HTMLElement) ?? target).getAttribute(
			'user-id',
		);
		const field = ((e.target as HTMLElement) ?? target).getAttribute(
			'field',
		);

		let entityBase = '';
		let domain = '';
		let service = 'set_value';
		let key = 'value';
		let value: string | number = '';
		switch (field) {
			case 'base_color':
				domain = 'input_text';
				entityBase = DEFAULT_BASE_COLOR_INPUT;
				break;
			case 'scheme':
				domain = 'input_select';
				service = 'select_option';
				key = 'option';
				value = ' ';
				entityBase = DEFAULT_SCHEME_NAME_INPUT;
				break;
			case 'contrast':
				domain = 'input_number';
				value = 0;
				entityBase = DEFAULT_CONTRAST_LEVEL_INPUT;
				break;
			default:
				break;
		}

		await this.hass.callService(domain, service, {
			[key]: value,
			entity_id: `${entityBase}${userId ? `_${userId}` : ''}`,
		});
		this.fireUpdateEvent();
		this.requestUpdate();
	}

	buildClearButton(field: string, userId?: string) {
		return html`
			<div class="clear button">
				<ha-icon
					@click=${this.handleClearClick}
					@keydown=${this.handleKeyDown}
					tabindex="0"
					user-id="${userId}"
					field="${field}"
					.icon="${'mdi:close'}"
				></ha-icon>
			</div>
		`;
	}

	handleMoreInfoClick(e: MouseEvent, target: HTMLElement) {
		const userId = ((e.target as HTMLElement) ?? target).getAttribute(
			'user-id',
		);
		const field = ((e.target as HTMLElement) ?? target).getAttribute(
			'field',
		);

		let entityBase = '';
		switch (field) {
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

		const entityId = `${entityBase}${userId ? `_${userId}` : ''}`;
		const event = new Event('hass-more-info', {
			bubbles: true,
			cancelable: true,
			composed: true,
		});
		event.detail = { entityId };
		this.dispatchEvent(event);
	}

	buildMoreInfoButton(field: string, userId?: string) {
		let entityBase = '';
		let icon = '';
		switch (field) {
			case 'base_color':
				entityBase = DEFAULT_BASE_COLOR_INPUT;
				icon = DEFAULT_BASE_COLOR_ICON;
				break;
			case 'scheme':
				entityBase = DEFAULT_SCHEME_NAME_INPUT;
				icon = DEFAULT_SCHEME_NAME_ICON;
				break;
			case 'contrast':
				entityBase = DEFAULT_CONTRAST_LEVEL_INPUT;
				icon = DEFAULT_CONTRAST_LEVEL_ICON;
				break;
			default:
				break;
		}

		const entityId = `${entityBase}${userId ? `_${userId}` : ''}`;
		icon = this.hass.states[entityId].attributes.icon || icon;

		return html`
			<div class="more-info button">
				<ha-icon
					@click=${this.handleMoreInfoClick}
					@keydown=${this.handleKeyDown}
					tabindex="0"
					user-id="${userId}"
					field="${field}"
					.icon="${icon}"
				></ha-icon>
			</div>
		`;
	}

	buildSettingsDatum(userId?: string) {
		let contrast: number = DEFAULT_CONTRAST_LEVEL;
		for (const value of [
			this.hass.states[
				`${DEFAULT_CONTRAST_LEVEL_INPUT}${userId ? `_${userId}` : ''}`
			]?.state,
			this.hass.states[DEFAULT_CONTRAST_LEVEL_INPUT]?.state,
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
					`${DEFAULT_BASE_COLOR_INPUT}${userId ? `_${userId}` : ''}`
				]?.state ||
				this.hass.states[DEFAULT_BASE_COLOR_INPUT]?.state ||
				DEFAULT_BASE_COLOR_HEX,
			scheme:
				this.hass.states[
					`${DEFAULT_SCHEME_NAME_INPUT}${userId ? `_${userId}` : ''}`
				]?.state ||
				this.hass.states[DEFAULT_SCHEME_NAME_INPUT]?.state ||
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
					${!this.hass.states[colorInput] ||
					!this.hass.states[schemeInput] ||
					!this.hass.states[contrastInput]
						? this.buildAlertBox(
								this.hass.user?.is_admin
									? `Press Create Helpers to create and initialize ${userId ? 'helpers for this user' : 'global default helpers'}.`
									: 'Some or all input helpers not setup! Ask an Home Assistant administrator to do so.',
								this.hass.user?.is_admin ? 'info' : 'error',
							)
						: ''}
					<div class="base-color">
						${this.hass.states[colorInput]
							? html`${this.buildMoreInfoButton(
										'base_color',
										userId,
									)}
									${this.buildSelector(
										'Base Color',
										'base_color',
										userId,
										{
											color_rgb: {},
										},
										settings.settings.base_color ||
											DEFAULT_BASE_COLOR_HEX,
									)}
									<div class="label">
										${settings.settings.base_color ||
										DEFAULT_BASE_COLOR_HEX}
									</div>
									${this.buildClearButton(
										'base_color',
										userId,
									)}`
							: ''}
					</div>
					<div class="scheme">
						${this.hass.states[schemeInput]
							? html`${this.buildMoreInfoButton(
									'scheme',
									userId,
								)}${this.buildSelector(
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
								)}`
							: ''}
					</div>
					<div class="contrast">
						${this.hass.states[contrastInput]
							? html`${this.buildMoreInfoButton(
									'contrast',
									userId,
								)}${this.buildSelector(
									'Contrast Level',
									'contrast',
									userId,
									{
										number: {
											min: -1,
											max: 1,
											step:
												this.hass.states[contrastInput]
													.attributes.step ?? 0.1,
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
								)}
								${this.buildClearButton('contrast', userId)}`
							: ''}
					</div>
				</div>
				${this.hass.user?.is_admin
					? html`<div class="card-actions">
							${this.buildCreateHelpersButton(
								userId,
							)}${this.buildDeleteHelpersButton(userId)}
						</div>`
					: ''}
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
				${!this.hass.themes.theme.includes('Material You')
					? this.buildAlertBox(
							'You are not using Material You Theme! Switch to it in your profile settings.',
							'warning',
						)
					: ''}
				<div class="section-header">
					<div class="title">You!</div>
					<div class="description">
						Your personal Material You settings.
					</div>
				</div>
				${this.buildSettingsCard(this.currentUserSettings)}
				${this.hass.user?.is_admin
					? html`
							<div class="section-header">
								<div class="title">Global Defaults</div>
								<div class="description">
									Default settings for all user which are used
									if no user specific settings are set.
								</div>
							</div>
							${this.buildSettingsCard(this.globalSettings)}
							${Object.keys(this.otherUserSettings).length
								? html`<div class="section-header">
										<div class="title">Other Users</div>
										<div class="description">
											Other user accounts on this Home
											Assistant instance.
										</div>
									</div>`
								: ''}
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
				width: min(600px, calc(100% - 36px));
			}
			.section-header {
				width: min(564px, 85%);
				margin-bottom: -12px;
			}
			.section-header .title {
				line-height: 48px;
				font-size: 32px;
				font-weight: 700;
			}
			.section-header .description {
				line-height: 24px;
				font-size: 16px;
				font-weight: 400;
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
			.base-color,
			.scheme,
			.contrast {
				display: flex;
				align-items: flex-end;
			}
			.base-color:empty,
			.scheme:empty,
			.contrast:empty {
				display: none;
			}
			.label {
				padding: 20px;
				margin: auto;
			}
			ha-selector[field='scheme'],
			ha-selector[field='contrast'] {
				margin: 0 4px;
			}

			.card-actions {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				height: 36px;
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
				transition: opacity 15ms linear;
			}
			@media (hover: hover) {
				.button:hover::after {
					opacity: var(--mdc-ripple-hover-opacity, 0.04);
				}
			}
			.button:active::after {
				opacity: var(--mdc-ripple-focus-opacity, 0.12);
			}
			ha-icon:focus-visible {
				outline: none;
			}
			.button:has(ha-icon:focus-visible)::after {
				opacity: var(--mdc-ripple-hover-opacity, 0.04);
			}
			.clear {
				height: var(--button-size);
				width: var(--button-size);
				padding: 10px;
				--color: var(--secondary-text-color);
				--button-size: 36px;
				--mdc-icon-size: 20px;
			}
			.more-info {
				flex: 1;
				height: var(--button-size);
				width: var(--button-size);
				margin: 8px;
				--color: var(--paper-item-icon-color);
				--button-size: 40px;
				--mdc-icon-size: 24px;
			}
			.more-info::after,
			.clear::after {
				width: var(--button-size);
			}
			.create,
			.delete {
				margin: 0 8px;
				height: var(--button-size);
				width: 100px;
				border-radius: var(--button-size);
				--button-size: 36px;
			}
			.create::after,
			.delete::after {
				width: 120px;
			}
			.create {
				--color: var(--primary-color);
			}
			.delete {
				--color: var(--error-color);
			}
		`;
	}
}
