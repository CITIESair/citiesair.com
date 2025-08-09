import { useState } from 'react';
import { Box, Tab, useMediaQuery } from '@mui/material';

import StyledTabs from '../../StyledTabs';
import AlertsTable from './AlertsTable';

import { AirQualityAlertKeys, getAlertDefaultPlaceholder, useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';
import AlertTypes from './AlertTypes';
import { isValidArray } from '../../../Utils/UtilFunctions';

function AlertTab(props) {
  const { children, value, index, alertType, alertsArray, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`alert-tabpanel-${alertType.id}`}
      aria-labelledby={`alert-tab-${alertType.id}`}
      width="100%"
      {...other}
    >
      <AlertsTable
        alertTypeKey={alertType.id}
        alertsForTable={alertsArray}
      />
    </Box>
  );
}

export default function AlertsTabs() {
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);

  const { setSelectedAlert } = useAirQualityAlert();

  const handleTabChange = (_, newVal) => {
    setCurrentTab(newVal);
    setSelectedAlert(
      getAlertDefaultPlaceholder(AlertTypes[Object.keys(AlertTypes)?.[newVal]]?.id)
    );
  };

  const { alerts } = useAirQualityAlert();

  // Helper function to return filered alert:
  // - based on alert_type (threshold or daily, depends on which alert tab is visible)
  // - only return alert that is not child to another alert
  const returnFilteredAlerts = (alertTypeKey) => {
    const filteredAlerts = alerts.filter((alert) => {
      if (!alert) return null;

      const alertType = alert[AirQualityAlertKeys.alert_type]?.toLowerCase();
      const parentAlertId = alert[AirQualityAlertKeys.parent_alert_id];

      if (alertType.includes(alertTypeKey) && (parentAlertId === null || parentAlertId === undefined)) return alert;
      else return null;
    });

    const alertsLength = isValidArray(filteredAlerts) ? filteredAlerts.length : "0";

    return {
      array: filteredAlerts,
      alertsLength
    }
  }

  return (
    <Box>
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        variant={smallScreen ? 'fullWidth' : 'standard'}
        smallFontSize="0.825rem"
      >
        {Object.values(AlertTypes).map((type) => {
          const filteredAlerts = returnFilteredAlerts(type.id);
          return (
            <Tab
              key={type.id}
              value={type.index}
              icon={type.icon}
              label={`${type.name} (${filteredAlerts?.alertsLength})`}
              iconPosition="start"
              sx={{ py: 0 }}
            />
          )
        }
        )}
      </StyledTabs>

      {Object.values(AlertTypes).map((type) => {
        const filteredAlerts = returnFilteredAlerts(type.id);
        return (
          <AlertTab
            key={type.id}
            alertType={type}
            value={currentTab}
            index={type.index}
            alertsArray={filteredAlerts.array}
          />
        )
      }
      )}
    </Box>
  );
}
