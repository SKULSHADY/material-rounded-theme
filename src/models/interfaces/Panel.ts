import { HassEntity } from 'home-assistant-js-websocket';

export interface IUserPanelSettings {
	baseColor: string;
	schemeName: string;
	contrastLevel: number;
	stateObj?: HassEntity;
}
