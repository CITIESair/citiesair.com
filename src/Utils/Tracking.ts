import { CITIESair_HOST_NAME } from "./GlobalVariables";

export const Events = {
  internalNavigation: 'internal_navigation',
  themeChange: 'theme_change',
  temperatureUnitChange: 'temperature_unit_change',
  rawDatasetButtonClicked: 'raw_dataset_button_clicked',
  rawDatasetDownloaded: 'raw_dataset_downloaded',
  expandSection: 'expand_section',
  collapseSection: 'collapse_section',
  openContactFormInExternalTab: 'open_contact_form_in_external_tab',
  airQualityIndexLegendQuickGlance: 'air_quality_index_legend_quick_glance',
  airQualityAlertButtonClicked: 'air_quality_alert_button_clicked',
} as const;

export type EventName = typeof Events[keyof typeof Events];

export const sendEventAnalytics = (eventName: EventName, options?: Record<string, any>) => {
  if (window.location.hostname === CITIESair_HOST_NAME) {
    window.gtag('event', eventName, options);
  }
};
