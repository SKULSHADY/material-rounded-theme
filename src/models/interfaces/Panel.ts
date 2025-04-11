import { HassEntity } from 'home-assistant-js-websocket';

export interface IUserPanelSettings {
	settings: {
		base_color: string;
		scheme: string;
		contrast: number;
		styles: string;
	};
	stateObj?: HassEntity;
}

export type InputType = 'text' | 'select' | 'number' | 'boolean';

export type InputField = 'base_color' | 'scheme' | 'contrast' | 'styles';
