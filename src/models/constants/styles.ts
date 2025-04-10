import haButton from '../.././css/ha-button.css';
import haDialog from '../.././css/ha-dialog.css';
import haEntityToggle from '../.././css/ha-entity-toggle.css';
import haFab from '../.././css/ha-fab.css';
import haSidebar from '../.././css/ha-sidebar.css';
import haSlider from '../.././css/ha-slider.css';
import haSwitch from '../.././css/ha-switch.css';
import haTabs from '../.././css/ha-tabs.css';
import haTextfield from '../.././css/ha-textfield.css';
import haToast from '../.././css/ha-toast.css';
import haUserBadge from '../.././css/ha-user-badge.css';
import hassSubpage from '../.././css/hass-subpage.css';
import huiEntitiesCard from '../.././css/hui-entities-card.css';
import huiGridSection from '../.././css/hui-grid-section.css';
import huiRoot from '../.././css/hui-root.css';
import huiViewVisibilityEditor from '../.././css/hui-view-visibility-editor.css';
import haAssistChip from '../../css/ha-assist-chip.css';

/**
 * Home Assistant (and other) custom elements to patch and their corresponding styles
 */
export const elements: Record<string, string> = {
	'ha-assist-chip': haAssistChip,
	'ha-button': haButton,
	'mwc-button': haButton,
	'ha-dialog': haDialog,
	'ha-entity-toggle': haEntityToggle,
	'ha-fab': haFab,
	'ha-sidebar': haSidebar,
	'ha-slider': haSlider,
	'md-slider': haSlider,
	'ha-switch': haSwitch,
	'ha-tabs': haTabs,
	'paper-tabs': haTabs,
	'ha-textfield': haTextfield,
	'ha-toast': haToast,
	'ha-user-badge': haUserBadge,
	'hass-subpage': hassSubpage,
	'hass-tabs-subpage': hassSubpage,
	'hui-entities-card': huiEntitiesCard,
	'hui-grid-section': huiGridSection,
	'hui-root': huiRoot,
	'hui-view-visibility-editor': huiViewVisibilityEditor,
};
