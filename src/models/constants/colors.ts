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

const SENSOR_PREFIX = 'sensor.material_you';
export const DEFAULT_BASE_COLOR_SENSOR = `${SENSOR_PREFIX}_base_color`;
export const DEFAULT_SCHEME_NAME_SENSOR = `${SENSOR_PREFIX}_scheme`;
export const DEFAULT_CONTRAST_LEVEL_SENSOR = `${SENSOR_PREFIX}_contrast`;

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

export const schemes: Record<string, IScheme> = {
	content: {
		name: 'Content',
		class: SchemeContent,
	},
	expressive: {
		name: 'Expressive',
		class: SchemeExpressive,
	},
	fidelity: {
		name: 'Fidelity',
		class: SchemeFidelity,
	},
	fruitsalad: {
		name: 'Fruit Salad',
		class: SchemeFruitSalad,
	},
	monochrome: {
		name: 'Monochrome',
		class: SchemeMonochrome,
	},
	neutral: {
		name: 'Neutral',
		class: SchemeNeutral,
	},
	rainbow: {
		name: 'Rainbow',
		class: SchemeRainbow,
	},
	tonalspot: {
		name: 'Tonal Spot',
		class: SchemeTonalSpot,
	},
	vibrant: {
		name: 'Vibrant',
		class: SchemeVibrant,
	},
};

export const logStyles = (
	color: string = '#ffffff',
	background: string = '#4c5c92',
) =>
	`color: ${color}; background: ${background}; font-weight: bold; border-radius: 32px; padding: 0 8px;`;
