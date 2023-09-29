import { useState, useEffect, createContext, useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import ChartComponent from '../Graphs/ChartComponent';

// import data
import JSONData from '../temp_database.json';

// create context
export const DataContext = createContext();

// context provider
export function HomePageProvider({ children }) {
  // state to store data
  const [data, setData] = useState({});

  useEffect(() => {
    const homeData = {};
    // loop through temp_database.json
    JSONData.forEach((item) => {
      homeData[item.id] = {
        isActive: item.isActive,
        id: item.id,
        title: item.title,
        owners: item.owners,
        chartCounts: item.charts?.length,
        graph: (item.isActive
          ? (
            <ChartComponent
              chartData={{
                sheetId: item.sheetId,
                ...item.charts[item.homepageChartIndex || 0],
              }}
              chartHeight="100%"
              isHomepage
            />
          ) : <ComingSoonBanner />
        ),
      };

      setData(homeData);
    });
  }, []);

  // Memoize the value to be provided to avoid unnecessary re-renders
  const providerValue = useMemo(() => [data, setData], [data]);

  // return context provider
  return (
    <DataContext.Provider value={providerValue}>
      {children}
    </DataContext.Provider>
  );
}

// banner for coming soon
function ComingSoonBanner() {
  return (
    <Grid container height="100%" justifyContent="center" alignItems="center">
      <Grid item>
        <Typography variant="h5" fontWeight={400} color="text.secondary">
          Coming Soon
        </Typography>
      </Grid>
    </Grid>
  );
}
