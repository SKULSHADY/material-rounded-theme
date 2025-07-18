import { load, dump } from 'js-yaml'
import { readFileSync, writeFileSync } from 'fs'


const THEME_NAME = 'Material You'
const THEME = THEME_NAME.toLowerCase().replace(/ /g, '_')

function main() {
	const packageInfo = JSON.parse(readFileSync('./package.json'))
	const src = load(readFileSync(`./src/${THEME}.yaml`))
	const dist = `./themes/${THEME}.yaml`
	const output = {}

	// Add version number
	output[THEME_NAME] =  structuredClone(src[THEME_NAME])
	output[THEME_NAME]['version'] = packageInfo.version

	writeFileSync(dist, dump(output))
}

main()