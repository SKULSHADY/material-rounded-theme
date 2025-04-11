from copy import deepcopy
import ruamel.yaml

def main():
	yaml = ruamel.yaml.YAML(typ='safe')
	yaml.width = 4096
	yaml.default_flow_style = False

	theme_name = 'Material You'
	with open('./themes/material_rounded.yaml', 'w') as dist:
		output = {}
		
		theme_file_name = theme_name.lower().replace(' ', '_')
		with open(f'./src/{theme_file_name}.yaml', 'r') as src:
			# Create base theme
			theme_title = theme_name
			base_theme = yaml.load(src)[theme_title]
			output[theme_title] = deepcopy(base_theme)

			# Create a transparent card background version of theme
			theme_title = f'{theme_name} Transparent Card'
			output[theme_title] = deepcopy(base_theme)
			output[theme_title]['ha-card-background'] = 'transparent'
			output[theme_title]['ha-card-box-shadow'] = 'none'
							
		yaml.dump(output, dist)

	# Create separate light and dark mode versions for special use cases
	with open(f'./themes/material_rounded.yaml', 'r+') as f:
		themes = yaml.load(f)
		new_themes = {}
		for sub_theme_name in themes.keys():
			light = deepcopy(themes[sub_theme_name])
			dark = deepcopy(themes[sub_theme_name])
			del light['modes']
			del dark['modes']

			modes = themes[sub_theme_name]['modes']
			for attribute in modes['light']:
				light[attribute] = modes['light'][attribute]
			for attribute in modes['dark']:
				dark[attribute] = modes['dark'][attribute]

			new_themes[sub_theme_name + ' Light'] = light
			new_themes[sub_theme_name + ' Dark'] = dark
		themes = { **themes, **new_themes}
		f.seek(0)
		yaml.dump(themes, f)
		f.truncate()


if __name__ == '__main__':
	main()