import { defaultSettings } from './defaultSettings';

export interface ISettingItem {
	id: keyof typeof defaultSettings;
	value: string;
}
