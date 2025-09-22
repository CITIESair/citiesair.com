import { Box, Table, TableBody, TableCell, TableHead, TableRow, styled } from '@mui/material';
import parse from 'html-react-parser';
import { getTranslation, replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';
import { AQI_Database } from '../../Utils/AirQuality/AirQualityIndexHelper';
import { useContext } from 'react';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';
import { CITIESair } from '../../Utils/GlobalVariables';

export const StyledTable = styled(Table, {
  shouldForwardProp: (prop) => prop !== 'tiny',
})(({ theme, tiny }) => ({
  minWidth: tiny || 700,
  '& th, td': {
    fontSize: tiny ? '0.625rem' : '0.6875rem',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: tiny ? '0.5rem' : '0.6875rem',
    },
  },
  '& th': {
    fontWeight: 500,
    color: theme.palette.text.primary,
    lineHeight: '1rem'
  }
}));

function AirQualityIndexTable(props) {
  const { themePreference, language } = useContext(PreferenceContext);

  const { tiny, hideAQIDescription } = props;

  const returnFormattedBreakpoints = (low, high) => {
    if (high === Infinity) return `${low}+`;
    else return `${low} - ${high}`;
  }

  return (
    <>
      <Box overflow="auto">
        <StyledTable size="small" tiny={tiny}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pr: 0 }}>
                <Box sx={{ width: '1em', height: '1em' }} />
              </TableCell>
              <TableCell sx={{ pl: 1 }}>
                Category
              </TableCell>
              <TableCell align="right">US AQI</TableCell>
              <TableCell align="right">
                PM2.5
                (µg/m
                <sup>3</sup>
                )
              </TableCell>
              {!hideAQIDescription && <TableCell align="left">Description</TableCell>}

              {!hideAQIDescription &&
                <TableCell align="left">
                  {CITIESair}&apos; Suggested Actions
                </TableCell>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {AQI_Database.map((element, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ pr: 0 }}>
                  <Box sx={{ width: '1em', height: '1em', backgroundColor: element.color[themePreference] }} />
                </TableCell>
                <TableCell sx={{ pl: 1 }}>
                  {getTranslation(element.category, language)}
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {returnFormattedBreakpoints(element.aqiUS.low, element.aqiUS.high)}
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {returnFormattedBreakpoints(element.rawPM2_5.low, element.rawPM2_5.high)}
                </TableCell>
                {!hideAQIDescription && <TableCell align="left">{element.description}</TableCell>}
                {!hideAQIDescription
                  && (
                    <TableCell align="left">
                      {
                        parse(getTranslation(element.healthSuggestions.outdoors, language), {
                          replace: replacePlainHTMLWithMuiComponents,
                        })
                      }
                    </TableCell>
                  )}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Box>
    </>
  );
}

export default AirQualityIndexTable;
