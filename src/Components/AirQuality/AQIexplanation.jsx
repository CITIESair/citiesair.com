import { useContext } from 'react';
import { Typography } from '@mui/material';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import AirQualityIndexTable from './AirQualityIndexTable';
import ExpandableSection from '../ExpandableSection';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';

const Explanation = {
  title: "Air Quality Index Explanation for Particulate Matter (PM2.5 & PM10)",
  subtitle: "CITIESair uses the <a href='https://www.airnow.gov/aqi/aqi-basics/'>Air Quality Index (AQI)</a> developed by the United States Environmental Protection Agency (EPA) to communicate different levels of Particulate Matter (PM). PM are microscopic particles small enough to be suspended in the air for a long period of time. Depends on the size, PM can be categorized into: PM10 (coarse particles <10µm) and PM2.5 (very fine particles <2.5µm). PM2.5 is smaller and can penetrate deeper and lodge into the lungs and internal organs, causing respiratory and cardiovascular diseases. PM2.5's origin is skewed towards more anthropogenic emissions, while PM10 are more likely to come from natural dust in the UAE.<br/><br/>To calculate AQI from raw concentrations of PM2.5 and PM10 concentration (µg/m³), different breakpoints and piecewise linear function are utilized (read more <a href='https://en.wikipedia.org/wiki/Air_quality_index#United_States'>here</a>). Higher AQI values correspond to poorer air quality and greater heath risks to humans.<br><br>The US EPA sets thresholds for PM2.5 concentration, recently updated in February 2024: <sup>[1]</sup><ul><li><b>Annual average</b>: 9.0 µg/m³, corresponding to US AQI <b>50</b></li><li><b>24-hour average</b>: 35.0 µg/m³, corresponding to US AQI <b>100</b></li></ul>In 2021, the World's Heath Organization (WHO) proposed a new guideline for PM2.5<sup>[2]</sup> with stricter thresholds than those of the US EPA:<ul><li><b>Annual average</b>: 5.0 µg/m³, corresponding to US AQI <b>21</b></li><li><b>24-hour average</b>: 15.0 µg/m³, corresponding to US AQI <b>56</b></li></ul>",
  reference: "[1] \"National Ambient Air Quality Standards (NAAQS) for PM.\" EPA, Environmental Protection Agency, https://www.epa.gov/pm-pollution/national-ambient-air-quality-standards-naaqs-pm.<br>[2] World Health Organization. \"WHO global air quality guidelines: particulate matter (PM2. 5 and PM10), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide: executive summary.\" (2021).",
}

const AQIexplanation = () => {
  const { themePreference } = useContext(PreferenceContext);

  return (
    <ExpandableSection
      title={Explanation.title}
      content={(
        <>
          <AirQualityIndexTable themePreference={themePreference} />
          <Typography
            component="div"
            variant="body1"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {parse(Explanation.subtitle, {
              replace: replacePlainHTMLWithMuiComponents,
            })}
          </Typography>
          <ExpandableSection
            title={"Reference"}
            content={(
              <Typography variant="caption" color="text.secondary">
                {parse(Explanation.reference, {
                  replace: replacePlainHTMLWithMuiComponents,
                })}
              </Typography>
            )}
          />
        </>
      )}
    />
  )
};

export default AQIexplanation;