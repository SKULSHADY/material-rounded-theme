import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import packageInfo from '../../package.json';
import {
	DEFAULT_BASE_COLOR,
	DEFAULT_BASE_COLOR_SENSOR,
	DEFAULT_CONTRAST_LEVEL,
	DEFAULT_CONTRAST_LEVEL_SENSOR,
	DEFAULT_SCHEME_NAME,
	DEFAULT_SCHEME_NAME_SENSOR,
} from '../models/constants/colors';
import { HomeAssistant } from '../models/interfaces';
import { IUserPanelSettings } from '../models/interfaces/Panel';

export class MaterialYouPanel extends LitElement {
	@property() hass!: HomeAssistant;
	@property() narrow!: boolean;
	@property() route!: object;
	@property() panel!: object;

	currentUserSettings!: IUserPanelSettings;
	globalSettings!: IUserPanelSettings;
	otherUserSettings: Record<string, IUserPanelSettings> = {};

	buildSettingsDatum(userId?: string) {
		return {
			baseColor:
				this.hass.states[
					`${DEFAULT_BASE_COLOR_SENSOR}${userId ? `_${userId}` : ''}`
				]?.state || DEFAULT_BASE_COLOR,
			schemeName:
				this.hass.states[
					`${DEFAULT_SCHEME_NAME_SENSOR}${userId ? `_${userId}` : ''}`
				]?.state || DEFAULT_SCHEME_NAME,
			contrastLevel: isNaN(
				parseFloat(
					this.hass.states[
						`${DEFAULT_CONTRAST_LEVEL_SENSOR}${userId ? `_${userId}` : ''}`
					]?.state,
				),
			)
				? DEFAULT_CONTRAST_LEVEL
				: parseFloat(
						this.hass.states[
							`${DEFAULT_CONTRAST_LEVEL_SENSOR}${userId ? `_${userId}` : ''}`
						]?.state,
					),
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
			...this.buildSettingsDatum(currentUserId),
		};

		// If admin, add global and all user settings
		if (this.hass.user?.is_admin) {
			this.globalSettings = this.buildSettingsDatum();

			for (const person of people) {
				const userId = this.hass.states[person].attributes.user_id;
				if (userId != currentUserId) {
					this.otherUserSettings[userId] = {
						stateObj: this.hass.states[person],
						...this.buildSettingsDatum(userId),
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
		let title = 'Global';
		if (settings.stateObj) {
			title = settings.stateObj.attributes.friendly_name ?? '';
		}

		return html`
			<ha-card .hass=${this.hass} .header=${title}>
				<div class="card-content">
					${settings.stateObj
						? html`<div class="secondary">
								User ID: ${settings.stateObj.attributes.user_id}
							</div>`
						: ''}
					<div class="row">Base Color: ${settings.baseColor}</div>
					<div class="row">Scheme Name: ${settings.schemeName}</div>
					<div class="row">
						Contrast Level: ${settings.contrastLevel}
					</div>
				</div>
			</ha-card>
		`;
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
				padding: 0 16px 16px;
				margin-top: -8px;
			}
		`;
	}
}
