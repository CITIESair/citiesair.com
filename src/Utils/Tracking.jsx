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
};

export const sendEventAnalytics = (eventName, options) => {
  if (window.location.hostname === 'citiesair.com') window.gtag('event', eventName, options);
};
