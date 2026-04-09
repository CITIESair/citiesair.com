import { Typography, Box } from '@mui/material';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';
import sectionData from '../../SectionData/sectionData';
import AirQualityIndexTable from './AirQualityIndexTable';
import ExpandableSection from '../ExpandableSection';
import InfoIcon from '@mui/icons-material/Info';

const AQIexplanation = () => {
  const { title, content } = sectionData.aqiExplanation;

  return (
    <ExpandableSection
      title={title}
      icon={<InfoIcon sx={{ fontSize: '1rem' }} />}
      content={(
        <Box>
          <AirQualityIndexTable />
          <Typography
            component="div"
            variant="body1"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {parse(content.mainText, {
              replace: replacePlainHTMLWithMuiComponents,
            })}
          </Typography>
          <ExpandableSection
            title="Reference"
            content={(
              <Typography variant="caption" color="text.secondary">
                {parse(content.reference, {
                  replace: replacePlainHTMLWithMuiComponents,
                })}
              </Typography>
            )}
          />
        </Box>
      )}
    />
  );
};

export default AQIexplanation;
