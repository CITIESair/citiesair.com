import { Box, Table, TableBody, TableCell, TableHead, TableRow, styled } from '@mui/material';
import parse from 'html-react-parser';
import { getTranslation, replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';
import { AQI_Database } from '../../business-domain/air-quality/air-quality.database';
import { usePreferences } from '../../ContextProviders/PreferenceContext';
import { CITIESair } from '../../Utils/GlobalVariables';
import { DataTypeKeys } from '../../business-domain/data-types/data-type.types';
import ThemePreferences from '../../Themes/ThemePreferences';
import type { LocalizedText } from '../../types/SectionData';

export interface AirQualityIndexTableProps {
  tiny?: boolean;
  hideAQIDescription?: boolean;
}

export const StyledTable = styled(Table, {
  shouldForwardProp: (prop) => prop !== 'tiny',
})<AirQualityIndexTableProps>(({ theme, tiny }) => ({
  minWidth: tiny ? undefined : 700,
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

const returnFormattedBreakpoints = (low: number, high: number): string => {
  if (high === Infinity) return `${low}+`;
  return `${low} - ${high}`;
};

const coerceLocalizedText = (field: unknown): string | LocalizedText => {
  if (typeof field === 'string') return field;
  return field as LocalizedText;
};

function AirQualityIndexTable(props: AirQualityIndexTableProps) {
  const { themePreference, language } = usePreferences();
  const { tiny, hideAQIDescription } = props;

  return (
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

            {!hideAQIDescription && (
              <TableCell align="left">
                {CITIESair}&apos; Suggested Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {AQI_Database.map((element, index) => {
            const outdoors = getTranslation(coerceLocalizedText(element.healthSuggestions.outdoors), language);
            const outdoorsNode =
              typeof outdoors === 'string'
                ? parse(outdoors, { replace: replacePlainHTMLWithMuiComponents })
                : outdoors;

            return (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ pr: 0 }}>
                  <Box sx={{ width: '1em', height: '1em', backgroundColor: element.color[themePreference] }} />
                </TableCell>
                <TableCell sx={{ pl: 1 }}>
                  {getTranslation(coerceLocalizedText(element.category), language)}
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  {returnFormattedBreakpoints(element[DataTypeKeys.aqi]!.low, element[DataTypeKeys.aqi]!.high)}
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  {returnFormattedBreakpoints(element[DataTypeKeys.pm2_5]!.low, element[DataTypeKeys.pm2_5]!.high)}
                </TableCell>
                {!hideAQIDescription && <TableCell align="left">{element.description}</TableCell>}
                {!hideAQIDescription && (
                  <TableCell align="left">
                    {outdoorsNode}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </Box>
  );
}

export default AirQualityIndexTable;
