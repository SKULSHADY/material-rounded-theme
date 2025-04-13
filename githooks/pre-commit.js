import { load, dump } from 'js-yaml'
import { readFileSync, writeFileSync } from 'fs'


const THEME_NAME = 'Material You'
const THEME = THEME_NAME.toLowerCase().replace(/ /g, '_')

function main() {
	const src = load(readFileSync(`./src/${THEME}.yaml`))
	const dist = './themes/material_rounded.yaml'
	const output = {}


	// Create base theme
	output[THEME_NAME] =  structuredClone(src[THEME_NAME])

	// Create transparent card version of theme
	const transparentCardThemeName = `${THEME_NAME} Transparent Card`
	output[transparentCardThemeName] = structuredClone(src[THEME_NAME])
	output[transparentCardThemeName]['ha-card-background'] = 'transparent'
	output[transparentCardThemeName]['ha-card-box-shadow'] = 'none'

	// Create separate light and dark mode versions of theme for special use cases
	for (const themeName of Object.keys(output)) {
		for (const mode of ['Light', 'Dark']) {
			const subThemeName = `${themeName} ${mode}`
			output[subThemeName] = structuredClone(output[themeName])	
			delete output[subThemeName]['modes']

			const modeKey = mode.toLowerCase()
			for (const attribute of Object.keys(output[themeName]['modes'][modeKey])) {
				output[subThemeName][attribute] = output[themeName]['modes'][modeKey][attribute]
			}
		}
	}

	writeFileSync(dist, dump(output))	
}

main()