import { Box, Table, TableBody, TableCell, TableHead, TableRow, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import ChartComponent from '../ChartComponent';
import AQIdatabase from '../../Utils/AirQualityIndexHelper';

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
  const { isTiny, hideAQIDescription } = props;

  const theme = useTheme();
  const isLightMode = theme.palette.primary.main === theme.palette.primary.light;

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
            {AQIdatabase.map((element) => (
              <TableRow
                key={element.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ pr: 0 }}>
                  <Box sx={{ width: '1em', height: '1em', backgroundColor: isLightMode ? element.lightThemeColor : element.darkThemeColor }} />
                </TableCell>
                <TableCell sx={{ pl: 1 }}>
                  {element.name}
                </TableCell>
                <TableCell align="right">
                  {element.aqiUS.low}
                  &nbsp;
                  -
                  &nbsp;
                  {element.aqiUS.high}
                </TableCell>
                <TableCell align="right">
                  {element.rawPM2_5.low}
                  &nbsp;
                  -
                  &nbsp;
                  {element.rawPM2_5.high}
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
      {!hideAQIDescription
        && (
          <ChartComponent
            chartHeight="4rem"
            chartData={
              {
                sheetId: '157f6vu47RBEvnBnW24jGI7cz-ov1aSBUFPdkb5sDKDc',
                gid: 1958405288,
                query: 'SELECT * WHERE A = "US AQI"',
                headers: 1,
                chartType: 'BarChart',
                columns: [0, 1, 3, 5, 7, 9, 11],
                options: {
                  legend: { position: 'none' },
                  enableInteractivity: false,
                  hAxis: {
                    ticks: [0, 50, 100, 150, 200, 300, 500]
                  },
                  chartArea:
                  {
                    width: { portrait: '98%', landscape: '50%' },
                    height: { portrait: '20%', landscape: '30%' }
                  },
                  isStacked: true,
                  colors: 'aqi',
                  bar: { groupWidth: '100%' }
                }
              }
            }
          />
        )}
    </>

  );
}

export default AirQualityIndexTable;
