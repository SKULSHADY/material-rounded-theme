import { load, dump } from 'js-yaml'
import { readFileSync, writeFileSync } from 'fs'


const THEME_NAME = 'Material You'
const THEME = THEME_NAME.toLowerCase().replace(/ /g, '_')

function main() {
	const packageInfo = JSON.parse(readFileSync('./package.json'))
	const src = load(readFileSync(`./src/${THEME}.yaml`))
	const dist = `./themes/${THEME}.yaml`
	const output = {}

	// Create base theme
	output[THEME_NAME] =  structuredClone(src[THEME_NAME])
	output[THEME_NAME]['version'] = packageInfo.version

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