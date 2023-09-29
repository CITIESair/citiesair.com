import { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchDataFromSheet, generateRandomID } from './GoogleChartHelper';
import { GoogleContext } from '../ContextProviders/GoogleContext';

function SampleDataTable(props) {
  const { chartData, marginBottom } = props;
  const [google, _] = useContext(GoogleContext);
  const [chartWrapper, setChartWrapper] = useState(null);

  const [chartID, __] = useState(generateRandomID());

  // Call this function to fetch the data and draw the initial chart
  useEffect(() => {
    if (google && !chartWrapper) {
      fetchDataFromSheet({ chartData })
        .then((response) => {
          const dataTable = response.getDataTable();

          const wrapper = new google.visualization.ChartWrapper({
            chartType: 'Table',
            dataTable,
            options: {
              width: '100%',
              sortAscending: true,
              frozenColumns: 1,
              cssClassNames: {
                headerRow: 'header-row',
                tableRow: 'table-row',
                oddTableRow: 'odd-table-row',
                selectedTableRow: 'selected-table-row',
                hoverTableRow: 'hover-table-row',
                headerCell: 'header-cell',
                tableCell: 'table-cell',
              }
            },
            view: {
              columns: chartData.columns
            },
            containerId: chartID
          });
          setChartWrapper(wrapper);
          wrapper.draw();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [google]);

  return (
    <StyledTable marginBottom={marginBottom}>
      <Box id={chartID} />
    </StyledTable>
  );
}

// Styled component for the Google Table chart
const StyledTable = styled('div')(({ theme, marginBottom }) => ({
  marginBottom: theme.spacing(marginBottom),
  '& table': {
    fontSize: '0.75rem',
  },
  '& .header-row, .frozen-column:first-of-type': {
    backgroundColor: theme.palette.customBackground,
    pointerEvents: 'none',
    textAlign: 'left'
  },
  '& .table-row, & .odd-table-row': {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.customAlternateBackground,
  },
  '& .table-row .table-cell:first-of-type, & .odd-table-row .table-cell:first-of-type':
  {
    fontWeight: 'bold',
    backgroundColor: theme.palette.customAlternateBackground,
  },

  '& .frozen-column': {
    borderRightWidth: '1px !important'
  }
}));

export default SampleDataTable;
