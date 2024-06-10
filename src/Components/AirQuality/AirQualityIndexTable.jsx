import { Box, Table, TableBody, TableCell, TableHead, TableRow, styled } from '@mui/material';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import AQIdatabase from '../../Utils/AirQuality/AirQualityIndexHelper';
import { useContext } from 'react';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';

export const StyledTable = styled(Table)(({ theme, isTiny }) => ({
  minWidth: isTiny || 700,
  '& th, td': {
    fontSize: isTiny ? '0.625rem' : '0.6875rem',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: isTiny ? '0.5rem' : '0.6875rem',
    },
  },
  '& th': {
    fontWeight: 500,
    color: theme.palette.text.primary,
    lineHeight: '1rem'
  }
}));

function AirQualityIndexTable(props) {
  const { themePreference } = useContext(PreferenceContext);

  const { isTiny, hideAQIDescription } = props;

  const returnFormattedBreakpoints = (low, high) => {
    if (high === Infinity) return `${low}+`;
    else return `${low} - ${high}`;
  }

  return (
    <>
      <Box overflow="auto">
        <StyledTable size="small" isTiny={isTiny}>
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
                PM2.5 Concentration
                (µg/m
                <sup>3</sup>
                )
              </TableCell>
              {!hideAQIDescription && <TableCell align="left">Description</TableCell>}
              {!hideAQIDescription && <TableCell align="left">CITIESair&apos; Suggested Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {AQIdatabase.map((element, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ pr: 0 }}>
                  <Box sx={{ width: '1em', height: '1em', backgroundColor: element.color[themePreference] }} />
                </TableCell>
                <TableCell sx={{ pl: 1 }}>
                  {element.category}
                </TableCell>
                <TableCell align="right">
                  {returnFormattedBreakpoints(element.aqiUS.low, element.aqiUS.high)}
                </TableCell>
                <TableCell align="right">
                  {returnFormattedBreakpoints(element.rawPM2_5.low, element.rawPM2_5.high)}
                </TableCell>
                {!hideAQIDescription && <TableCell align="left">{element.description}</TableCell>}
                {!hideAQIDescription
                  && (
                    <TableCell align="left">
                      {
                        parse(element.healthSuggestions.outdoors, {
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
