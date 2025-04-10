import {
	MaterialDynamicColors,
	SchemeContent,
	SchemeExpressive,
	SchemeFidelity,
	SchemeFruitSalad,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeRainbow,
	SchemeTonalSpot,
	SchemeVibrant,
} from '@material/material-color-utilities';
import { IScheme } from '../interfaces/Scheme';

export const DEFAULT_BASE_COLOR = '#4C5C92';
export const DEFAULT_SCHEME_NAME = 'tonalspot';
export const DEFAULT_CONTRAST_LEVEL = 0;

const THEME = 'material_you';
export const SENSOR_PREFIX = `sensor.${THEME}`;
export const DEFAULT_BASE_COLOR_SENSOR = `${SENSOR_PREFIX}_base_color`;
export const DEFAULT_SCHEME_NAME_SENSOR = `${SENSOR_PREFIX}_scheme`;
export const DEFAULT_CONTRAST_LEVEL_SENSOR = `${SENSOR_PREFIX}_contrast`;

export const INPUT_TEXT_PREFIX = `input_text.${THEME}`;
export const DEFAULT_BASE_COLOR_INPUT = `${INPUT_TEXT_PREFIX}_base_color`;
export const DEFAULT_SCHEME_NAME_INPUT = `${INPUT_TEXT_PREFIX}_scheme`;
export const DEFAULT_CONTRAST_LEVEL_INPUT = `${INPUT_TEXT_PREFIX}_contrast`;

export const THEME_NAME = 'Material You';

export const colors: (keyof typeof MaterialDynamicColors)[] = [
	'primary',
	'onPrimary',
	'primaryContainer',
	'onPrimaryContainer',
	'primaryPaletteKeyColor',
	'inversePrimary',
	'primaryFixed',
	'primaryFixedDim',
	'onPrimaryFixed',
	'onPrimaryFixedVariant',
	'secondary',
	'onSecondary',
	'secondaryContainer',
	'onSecondaryContainer',
	'secondaryPaletteKeyColor',
	'secondaryFixed',
	'secondaryFixedDim',
	'onSecondaryFixed',
	'onSecondaryFixedVariant',
	'tertiary',
	'onTertiary',
	'tertiaryContainer',
	'onTertiaryContainer',
	'tertiaryPaletteKeyColor',
	'tertiaryFixed',
	'tertiaryFixedDim',
	'onTertiaryFixed',
	'onTertiaryFixedVariant',
	'neutralPaletteKeyColor',
	'neutralVariantPaletteKeyColor',
	'error',
	'onError',
	'errorContainer',
	'onErrorContainer',
	'surface',
	'onSurface',
	'surfaceVariant',
	'onSurfaceVariant',
	'surfaceDim',
	'surfaceBright',
	'surfaceContainerLowest',
	'surfaceContainerLow',
	'surfaceContainer',
	'surfaceContainerHigh',
	'surfaceContainerHighest',
	'inverseSurface',
	'inverseOnSurface',
	'surfaceTint',
	'outline',
	'outlineVariant',
	'shadow',
	'scrim',
];

export const schemes: IScheme[] = [
	{
		value: 'tonalspot',
		label: 'Tonal Spot',
		class: SchemeTonalSpot,
	},
	{
		value: 'content',
		label: 'Content',
		class: SchemeContent,
	},
	{
		value: 'fidelity',
		label: 'Fidelity',
		class: SchemeFidelity,
	},
	{
		value: 'expressive',
		label: 'Expressive',
		class: SchemeExpressive,
	},
	{
		value: 'fruitsalad',
		label: 'Fruit Salad',
		class: SchemeFruitSalad,
	},
	{
		value: 'rainbow',
		label: 'Rainbow',
		class: SchemeRainbow,
	},
	{
		value: 'vibrant',
		label: 'Vibrant',
		class: SchemeVibrant,
	},
	{
		value: 'neutral',
		label: 'Neutral',
		class: SchemeNeutral,
	},
	{
		value: 'monochrome',
		label: 'Monochrome',
		class: SchemeMonochrome,
	},
];

export const logStyles = (
	color: string = '#ffffff',
	background: string = '#4c5c92',
) =>
	`color: ${color}; background: ${background}; font-weight: bold; border-radius: 32px; padding: 0 8px;`;
