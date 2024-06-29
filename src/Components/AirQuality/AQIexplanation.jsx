import { useContext } from 'react';
import { Typography, Box } from '@mui/material';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import AirQualityIndexTable from './AirQualityIndexTable';
import ExpandableSection from '../ExpandableSection';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';

const Explanation = {
  title: "Explanation of the US Air Quality Index (AQI) for PM2.5",
  subtitle: "CITIESair uses the <a href='https://www.airnow.gov/aqi/aqi-basics/'>Air Quality Index (AQI)</a> developed by the United States Environmental Protection Agency (EPA) to effectively communicate different levels of PM2.5 air pollution. To calculate the AQI from the raw measurement of PM2.5 concentration (µg/m³), different breakpoints and piecewise linear function are utilized (read more <a href='https://en.wikipedia.org/wiki/Air_quality_index#United_States'>here</a>). Higher AQI values correspond to poorer air quality and greater heath risks to humans.<br><br>The US EPA sets thresholds for PM2.5 concentration, recently updated in February 2024: <sup>[1]</sup><ul><li><b>Annual average</b>: 9.0 µg/m³, corresponding to US AQI <b>50</b></li><li><b>24-hour average</b>: 35.0 µg/m³, corresponding to US AQI <b>100</b></li></ul>In 2021, the World's Heath Organization (WHO) proposed a new guideline for PM2.5<sup>[2]</sup> with stricter thresholds than those of the US EPA:<ul><li><b>Annual average</b>: 5.0 µg/m³, corresponding to US AQI <b>21</b></li><li><b>24-hour average</b>: 15.0 µg/m³, corresponding to US AQI <b>56</b></li></ul>",
  reference: "[1] \"National Ambient Air Quality Standards (NAAQS) for PM.\" EPA, Environmental Protection Agency, https://www.epa.gov/pm-pollution/national-ambient-air-quality-standards-naaqs-pm.<br>[2] World Health Organization. \"WHO global air quality guidelines: particulate matter (PM2. 5 and PM10), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide: executive summary.\" (2021).",
}

const AQIexplanation = () => {
  const { themePreference } = useContext(PreferenceContext);

  return (
    <ExpandableSection
      title={Explanation.title}
      content={(
        <Box>
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
        </Box>
      )}
    />
  )
};

export default AQIexplanation;