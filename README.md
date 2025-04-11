[![GitHub Release](https://img.shields.io/github/release/Nerwyn/material-rounded-theme.svg?style=for-the-badge)](https://github.com/nerwyn/material-rounded-theme/releases)
[![License](https://img.shields.io/github/license/Nerwyn/material-rounded-theme.svg?style=for-the-badge)](LICENSE)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-blue.svg?style=for-the-badge)](https://github.com/hacs/default)
[![Project Maintenance](https://img.shields.io/badge/maintainer-Nerwyn-blue.svg?style=for-the-badge)](https://github.com/Nerwyn)
![Github](https://img.shields.io/github/followers/Nerwyn.svg?style=for-the-badge)
[![GitHub Activity](https://img.shields.io/github/last-commit/Nerwyn/material-rounded-theme?style=for-the-badge)](https://github.com/Nerwyn/material-rounded-theme/commits/main)
[![Community Forum](https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge)](https://community.home-assistant.io/t/material-rounded-a-google-material-you-inspired-theme/623242)
[![Buy Me A Coffee](https://img.shields.io/badge/donate-☕buy_me_a_coffee-yellow.svg?style=for-the-badge)](https://www.buymeacoffee.com/nerwyn)

[![My Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=material-rounded-theme&owner=Nerwyn&category=Plugin)

# Material You Theme - A Fully Featured Implementation of Material Design 3 for Home Assistant

A theme for Home Assistant influenced by Google apps and Material Design 3 by Google on Android.

This theme is made up of two components:

1. A standard Home Assistant theme yaml file.
2. A JavaScript module that generates user defined material color themes and modifies the styles of many Home Assistant components to follow the [Material Design 3 specifications](https://m3.material.io/).

This theme implements Material Design 3 redesigns of elements when possible using a mix of Home Assistant theme variables and CSS styles applied to Home Assistant custom element constructor lifecycle methods.

This theme also includes "Transparent Card" versions with transparent card backgrounds. It also includes separate light and dark versions of all themes for niche use cases. These variations are combined into several different versions of the theme.

Everything in Home Assistant has been updated to use colors generated using [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) following the [Material Design 3 guidelines](https://m3.material.io/). It supports custom user colors for virtually all of Home Assistant. If no user base color is provided the themes defaults to a shade of blue, `#4C5C92`.

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/material-you-rainbow.png" alt="material-you-rainbow" width="750"/>

## Compared to Google Home

<p>
<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/material-you-comparison-blue-dark.png" alt="material-you-comparison-blue-dark" width="375"/>
<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/material-you-comparison-blue-light.png" alt="material-you-comparison-blue-light" width="375"/>
</p>

<p>
<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/material-you-comparison-red-dark.png" alt="material-you-comparison-red-dark" width="375"/>
<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/material-you-comparison-red-light.png" alt="material-you-comparison-red-light" width="375"/>
</p>

## Basic Theme Installation

1. Navigate to HACS (install from [here](https://hacs.xyz/) if you do not have it yet).
2. Navigate to `Frontend`.
3. Click `+ EXPLORE & DOWNLOAD REPOSITORIES` and search for `Material You Theme`.
4. Open this repository in HACS and click `DOWNLOAD`.
5. Refresh your browser or close and open your app.
6. Navigate to your Profile, and select `Material You` or one of its variants.

**If you set the theme at the view level, it will not style the anything outside of the view. The view tabs and sidebar are outside of the view. You MUST set the theme in [profile settings](http://homeassistant.local:8123/profile/general) under browser settings for component design upgrades to work.**

## JavaScript Module Installation

This theme includes a companion module which turns this theme from a basic Home Assitant theme into a complete Material Design 3 overhaul of Home Assistant. You'll be able to use different colors, schemes, and contrast levels in your theme colors, and will be able to change the entirety of the Home Assistant user interface to look like a modern Material You app. This can all be configured from a settings page included with this

<!-- ## Material You Color Theme Generation

This theme supports Material You color theming! This requires either an additional JavaScript module resource or use of [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/). The JavaScript module resource can either be downloaded from this repository or used using a CDN URL.

If you do not want to install the JavaScript module but do want your own color theme, skip ahead to [Build Your Own Theme](#build-your-own-theme) -->

### (Optional) Download The JavaScript Module Resource Locally in Home Assistant

While the module should be cached in browser after first use, you can download it locally to ensure that the module works offline and consistently.

1. Download the module from this repository [here](https://github.com/Nerwyn/material-rounded-theme/blob/main/dist/material-you-utilities.min.js).
2. Upload this module to your Home Assistant instance, preferable in the `config/www` folder or a subfolder.
   - Your `configuration.yaml` file is found in the `config` folder. If the `www` folder does not exist create it. More information about the configuration folder can be found [here](https://www.home-assistant.io/docs/configuration/#to-find-the-configuration-directory).

**Remember!** You must update your local copy of this module manually as update are made. Release notes will call out JavaScript module changes. Don't forget to also thoroughly clear cache on all devices!

### Add the Module as a Frontend Module and Custom Panel

The component design upgrades performed by this module are very time sensitive, and must be run as soon as possible. Because of this you should install it as the first frontend module in your `configuration.yaml` file.

1. Open your `configuration.yaml` (see above for information about the configuration folder).
2. Add the file URL to `frontend` `extra_module_url`, adding the `frontend` and `extra_module_url` keys if they do not exist, and adding to them if they do.
   - If you have links to any old versions of the theme here or in frontend resources, **delete them**.

```yaml
frontend:
  extra_module_url:
    - /local/material-you-utilities.min.js # Or the CDN URL
```

CDN URL: https://cdn.jsdelivr.net/gh/nerwyn/material-rounded-theme@main/dist/material-you-utilities.min.js

3. Add the following to `panel_custom`, creating it if it does not exist. This will allow you to access the Material You Theme configuration page.

```yaml
panel_custom:
  - name: material-you-panel
    url_path: material-you-configuration
    sidebar_title: Material You Theme
    sidebar_icon: mdi:material-design
    module_url: /local/material-you-utilities.min.js # Or the CDN URL
```

4. Restart Home Assistant.

Once Home Assistant has finished restarting, you should see the upgrade Material Design 3 components and the Material You Theme settings page in the sidebar. You may need to clear app/browser cache.

## The Configuration Page

This theme comes with it's own configuration page! If you are the server administrator, you can use this page to create and set input helper entities for all users and global defaults. If you are not the server administrator, then you can set the input helper entities for yourself, but an administrator must create them first.

TODO screenshot of finalized configuration page

The settings for every user and the global settings are all the same. If a user does not have a setting set, then the global setting is used.

To create input helper entities for a user, click on `Create Helpers` in their settings card. Similarly, you can delete input helper entities for a user by clicking `Delete Helpers`.

### Base Color

Material color themes are built around a base color, from which all other theme colors are derived depending on the scheme rules. This color defaults to `#4C5C92`, but can be set to any other color using the color picker.

TODO screenshot of color picker in use

#### Home Assistant Android App Color Sensor

If you are using the Home Assistant Android companion app, you can enable the accent color sensor in the companion app settings to use your phones Material You accent color as the theme base color:

1. Navigate to `Settings` > `Companion app`.
2. Click `Manage sensors.`
3. Scroll down to the section titled `Dynamic color` and click `Accent color`.
4. Toggle `Enable sensor` on. It should now return your phone's Material You base color as a hex code.

You can then create an automation to set your Material You base color whenever the sensor changes.

```yaml
description: ''
mode: single
triggers:
  - trigger: state
    entity_id:
      - sensor.pixel_fold_accent_color
conditions: []
actions:
  - action: input_text.set_value
    metadata: {}
    data:
      value: '{{ states("sensor.pixel_fold_accent_color") }}'
    target:
      entity_id: input_text.material_you_base_color
```

### Alternate Schemes

By default, this theme will use the `Tonal Spot` color scheme. This scheme is the default color scheme used by Android 12 and later.

In addition to the modern Android color scheme, [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) offers several alternate schemes.

| Name        | Description                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tonal Spot  | Dynamic Color theme with low to medium colorfulness and a Tertiary TonalPalette with a hue related to the source color.<br> The default Material You theme on Android 12 and later.                                                                                                                                                                                                                                     |
| Content     | A scheme that places the source color in `Scheme.primaryContainer`.<br> Primary Container is the source color, adjusted for color relativity.<br> It maintains constant appearance in light mode and dark mode.<br> This adds ~5 tone in light mode, and subtracts ~5 tone in dark mode.<br> Tertiary Container is the complement to the source color, using `TemperatureCache`. It also maintains constant appearance. |
| Fidelity    | A scheme that places the source color in `Scheme.primaryContainer`.<br> Primary Container is the source color, adjusted for color relativity.<br> It maintains constant appearance in light mode and dark mode.<br> This adds ~5 tone in light mode, and subtracts ~5 tone in dark mode.<br> Tertiary Container is the complement to the source color, using `TemperatureCache`. It also maintains constant appearance. |
| Expressive  | A Dynamic Color theme that is intentionally detached from the source color.                                                                                                                                                                                                                                                                                                                                             |
| Fruit Salad | A playful theme - the source color's hue does not appear in the theme.                                                                                                                                                                                                                                                                                                                                                  |
| Rainbow     | A playful theme - the source color's hue does not appear in the theme.                                                                                                                                                                                                                                                                                                                                                  |
| Vibrant     | A Dynamic Color theme that maxes out colorfulness at each position in the Primary Tonal Palette.                                                                                                                                                                                                                                                                                                                        |
| Neutral     | A Dynamic Color theme that is near grayscale.                                                                                                                                                                                                                                                                                                                                                                           |
| Monochrome  | A Dynamic Color theme that is grayscale.                                                                                                                                                                                                                                                                                                                                                                                |

If an invalid or no scheme is provided, it will default to `Tonal Spot` or the globally set scheme.

### Contrast Level

Each scheme can also be provided with a custom contrast from -1 to 1. Value outside of this range are clamped to it. If an invalid or no value is provided it will default to `0`.

## Build Your Own Theme

If you do not want to use the JavaScript module resource or create helper sensors, you can instead create your own Material Theme using [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/).

**NOTE**: themes created this way will not apply to iframes such as the HACS and Add-ons pages. It will also not apply to some page backgrounds like the settings and developer tools pages, which are hardcoded to a default color. It will also be superceded by any themes set using the configuration page.

1. Navigate to [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/).
2. Choose your theme colors. You can skip picking fonts, they are not saved to the exported files.
3. Click `Export theme`, click `Export`, and then click `Web (CSS)`.
4. Extract the CSS files from the downloaded zip archive and open the css folder within it.
5. Choose a matching set of light and dark css files with the same contrast extension (or mix and match) and open them in a text editor.
   - `light.css` and `dark.css` are standard, `-mc` is medium contrast, and `-hc` is high contrast.
6. Find and replace (`CTRL` + `F`) all colons `:` in the CSS files and replace them with `-light:` in the light file and `-dark:` in the dark file.
7. Copy all of the variables from one file to the other, and rename the selector (`.dark`, `.light-high-contrast`, etc) to `html`. It should look something like this:

```css
html {
  --md-sys-color-primary-dark: rgb(242 220 130);
  --md-sys-color-surface-tint-dark: rgb(219 198 110);
  --md-sys-color-on-primary-dark: rgb(45 37 0);
  --md-sys-color-primary-container-dark: rgb(163 144 63);
  ...
  --md-sys-color-surface-container-lowest-light: rgb(255 255 255);
  --md-sys-color-surface-container-low-light: rgb(250 243 229);
  --md-sys-color-surface-container-light: rgb(238 232 218);
  --md-sys-color-surface-container-high-light: rgb(227 220 207);
  --md-sys-color-surface-container-highest-light: rgb(215 209 196);
}
```

8. (Optional) Rename the file to something recognizable, like `material-design-colors.css`

9. Upload this file to your Home Assistant instance, preferable in the config/www folder.
   - Your `configuration.yaml` file is found in the `config` folder. If the `www` folder does not exist create it. More information about the configuration folder can be found [here](https://www.home-assistant.io/docs/configuration/#to-find-the-configuration-directory).
10. Navigate to a dashboard and then click `🖉 Edit dashboard` > `⋮ Open dashboard menu` > `Manage resources`.
11. Click `+ ADD RESOURCE`.
12. In the `URL` field enter the path to the resource file.
    - Like `/local/material-design-colors.css`
13. Select `Resource Type` `Stylesheet`.
14. Click `CREATE`.
15. Hard refresh (`CTRL` + `F5`) your browser or clear app/browser cache to ensure the new resource loads correctly.

## Material You Components

This themes companion module modifies the lifecycle methods styles of many Home Assistant component constructors to inject additional CSS styles to make the components follow the Material Design 3 specification.

TODO screenshots of all of these, be creative with theme settings

### Navigation

#### [Top App Bar](https://m3.material.io/components/top-app-bar/overview)

- Retains the sidebar toggle and dashboard menu (small width screens) or action items (large width screens) from the navigation toolbar header in a top app bar.
- Non-view buttons appear at top of screen near their original locations.
- Adds the current view title to the center.
- Height increased to 64px.
- Disappears when user is not scrolled to the top of the view.
  - This is imperfect, and the top app bar does not reappear until you are scrolled all the way back to the top of the screen.
- Use a variant color for trailing buttons and edit mode.
- Current view name added as headline.

#### [Navigation Bar](https://m3.material.io/components/navigation-bar/overview)

- Converts the toolbar header view tabs bar into a navigation bar footer.
- Removes the default selection bar and ripple.
- Spaces destinations evenly along the entire toolbar on smaller displays.
- Evenly displays destinations in the center of the screen on larger displays.
- Adds view names below the view icons.
- Increase font weight of current view tab name.
- Highlights the current view with a colored icon and background behind the icon.
- Transition animation on view icon background when selected.
- [State layers](https://m3.material.io/foundations/interaction/states/state-layers) on hover, focus, and press.

#### [Navigation Drawer](https://m3.material.io/components/navigation-drawer/overview)

Desktop sidebar expanded and mobile.

- Icon and background of current page now uses material design secondary container colors.
- Transition animation on view icon background when selected.
- Badge background color removed and color set to same as icon and text.
- Increase font weight of current page name.
- [State layers](https://m3.material.io/foundations/interaction/states/state-layers) on hover, focus, and press.

#### [Navigation Rail](https://m3.material.io/components/navigation-rail/overview)

Desktop sidebar collapsed.

- Background of current page now uses material design secondary container colors.
- Current view icon background is a circle to match Material You example of a navigation rail menu without labels.
  - While this style has been deprecated in the MD3 guidelines, it still appears in screenshots and apps and makes sense here.
- Badge colors changed to material design error colors (red).
- [State layers](https://m3.material.io/foundations/interaction/states/state-layers) on hover, focus, and press.

### Buttons

#### [Text Buttons](https://m3.material.io/components/buttons/specs#899b9107-0127-4a01-8f4c-87f19323a1b4)

Buttons that are just text with no background.

- Font size, weight, height, letter spacing, and capitalization adjusted to match specification.
- Button height increased.
- Button border radius made circular.
- Ripple color changed to match text color.

#### [Outlined Buttons](https://m3.material.io/components/buttons/specs)

Like text buttons, but with an outline.

- Same changes as text buttons.
- Increase horizontal padding to 24px.

#### [Extended FAB](https://m3.material.io/components/extended-fab/overview)

Floating action buttons which appear in legacy views, and the integrations, devices, and helpers pages.

- Increase height to 56px.
- Decrease border radius to 16px.
- Use primary container colors.
- Increase bottom position when used as an add card button on legacy views.

### Inputs

#### [Switches](https://m3.material.io/components/switch/overview)

Toggle switches for setting boolean values.

- Track now encompasses thumb.
- Removes the default ripple in favor of a thumb that changes size when used.
- Uses material design colors for the switch thumb, track, and outline.
- [State layers](https://m3.material.io/foundations/interaction/states/state-layers) on hover, focus, and press.

#### [Sliders](https://m3.material.io/components/sliders/overview)

Numerical inputs optimized for human interaction.

- Thumb is now tall and narrow with a border the same color as card backgrounds.
- Track is taller.
- Tooltip uses inverse surface colors and is positioned above the slider.
- Remove ripples, narrow thumb on focus, and only show label on active.

### Informational

#### [Chips](https://m3.material.io/components/chips/overview)

Small elements sometimes found in configuration pages and can be added to the bottom of some cards in their footers as buttons.

- Follows the assist chip specification, as that is what its most similar to and what the component is named.
- Background set to match the card (when card is not transparent).
- Border radius decreased to 8px.
- Outline added that differentiates the chip from its background.

#### [Snackbars](https://m3.material.io/components/snackbar/overview)

Floating messages that appear on the bottom of the screen, also known as toasts.

- Moved above the navigation bar.
- Font size, weight, height, letter spacing, and capitalization adjusted to match specification.
- Use inverse primary colors instead of static colors.

### Views

- Adds an 82px margin to the bottom of the view for the navigation bar when it is present.
  - The navigation bar padding is not present on subviews and single view dashboards.
  - This padding is also removed in kiosk mode.
- Increase `--ha-sections-view-row-gap` to 18px, which is also used for the column gap on mobile displays to match Google Home app.

## Similar Projects and Credits

### Big Slider Card

Use [Big Slider Card](https://github.com/nicufarmache/lovelace-big-slider-card) to create Google Home style button/slider cards for light entities. Use the following style settings to match the screenshots:

```yaml
colorize: true
show_percentage: true
bold_text: true
height: 88
```

And for lights that do not have brightness control:

```yaml
color: sandybrown
show_percentage: false
bold_text: true
height: 88
max: 0
```

### Material Symbols

Check out [Material Symbols](https://github.com/beecho01/material-symbols) to use updated material icons as shown in the screenshots!

### Material Color Utilities

This theme revolves around Material Design 3 and the tooling that its contributors have made available, especially [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) and the [Material Design 3 specification](https://m3.material.io/).

### Figtree Font

During development of this theme, I experimented with various fonts to find one that was both very similar to Google Sans font and free to use. After much comparison, I found that [Figtree](https://fonts.google.com/specimen/Figtree) was very close, and added it to this themes font-family priority list. You can install it as a frontend resource in Home Assistant using [this URL](https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap).

## Developing, Modifying, and Building The Theme

This theme has a build pipeline which runs on pre-commit. It requires both npm/Node.js and Python (I should really port the Python part to Node). To setup the pre-commit hook, run the command `npm run setup`.

### YAML Theme

The `material_you.yaml` file found in the `src` folder is the base version of the theme. It has defaults set for all Material Design System colors in light and dark mode, which are then used for all other theme variables. The pre-commit build pipeline will run a Python file name `pre-commit.py`, which creates six versions of this theme for transparent card backgrounds, and explicit dark and light modes.

### JavaScript module

The JavaScript module is a minified file compiled using webpack. The source files are all written using TypeScript.

There are four main files:

- `src/classes/material-you-panel.ts` - the configuration page.
- `src/utils/colors.ts` - the color theming set and unset functions.
- `src/utils/styles.ts` - the component style upgrade application functions.
- `src/material-you-utilities.ts` - the entrypoint file which calls these functions, sets up triggers, and defines the configuration panel custom element.

TypeScript types and interface and constants can be found in `src/models`. Other helper functions can be found in `src/utils`.

The styles used by the component style upgrade functions can be found in the `src/css` folder, where they are named after the custom elements they are applied to. They must also be added to the `src/constants/styles.ts` file elements object to be picked up by the component style upgrade functions.

To build this theme, either make a commit (to your own fork) or run the command `npm run build`. The compiled JavaScript module is located at `dist/material-you-utilities.min.js`. Webpack can take a little bit of time to run, especially the first time you run it after opening the terminal.
