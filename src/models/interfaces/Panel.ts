import { HassEntity } from 'home-assistant-js-websocket';

export interface IUserPanelSettings {
	settings: {
		base_color: string;
		scheme: string;
		contrast: number;
	};
	stateObj?: HassEntity;
}
