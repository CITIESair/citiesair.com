import { useContext, useState } from 'react';
import { Box, Button, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Alert, Grow, Switch, Chip } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';

import { useTheme } from '@emotion/react';
import { AirQualityAlertKeys, getAlertPlaceholder, useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';

import AlertTypes from './AlertTypes';
import { ThresholdAlertTypes } from './AlertTypes';

import { isValidArray } from '../../../Utils/UtilFunctions';
import AlertModificationDialog from './AlertModificationDialog/AlertModificationDialog';

import { returnHoursFromMinutesPastMidnight, CrudTypes, SharedColumnHeader } from './Utils';
import { TransitionGroup } from 'react-transition-group';
import { DataTypes } from '../../../Utils/AirQuality/DataTypes';
import { DAYS_OF_WEEK } from './AlertModificationDialog/DAYS_OF_WEEK';
import { fetchDataFromURL } from '../../../API/ApiFetch';
import { GeneralAPIendpoints, RESTmethods } from '../../../API/Utils';
import { DashboardContext } from '../../../ContextProviders/DashboardContext';
import { SnackbarMetadata } from '../../../Utils/SnackbarMetadata';
import { getAlertsApiUrl } from '../../../API/ApiUrls';
import { useSnackbar } from 'notistack';
import { UserRoles } from '../../Account/Utils';

const returnDaysOfWeekString = (days_of_week) => {
  if (!days_of_week || !isValidArray(days_of_week)) return "N/A";

  // Case where all days are selected
  if (days_of_week.length === DAYS_OF_WEEK.length) return "Everyday";

  // Check if two days are missing and if both are weekend days
  const missingDays = DAYS_OF_WEEK.filter(d => !days_of_week.includes(d.value));
  if (missingDays.length === 2 && missingDays.every(d => [5, 6].includes(d.value))) {
    return "Only weekdays";
  }

  // Default case: map the selected days to their short labels
  return days_of_week
    .map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label.slice(0, 2))
    .join(', ');
};

const returnCreatedByString = (owner_role, self_is_owner) => {
  if (self_is_owner === true) return "You";

  if (owner_role) return UserRoles[owner_role].name;
  else return "N/A";
}

const returnAlertNotModifiableString = (owner_role, is_allowed_to_modify) => {
  if (is_allowed_to_modify) return "";

  if (owner_role && UserRoles[owner_role]) {
    return `${UserRoles[owner_role].name} added your email to this school-wide alert. For edit or removal, please reach out to ${UserRoles[owner_role].name}.`;
  }
};

const AlertsTable = (props) => {
  const { selectedAlert, setSelectedAlert, setAlerts } = useAirQualityAlert();
  const { currentSchoolID } = useContext(DashboardContext);
  const { enqueueSnackbar } = useSnackbar()

  const { alertTypeKey, alertsForTable } = props;

  const theme = useTheme();

  const [openAlertModificationDialog, setOpenAlertModificationDialog] = useState(false);
  const [crudType, setCrudType] = useState(null);

  const handleModifyClick = ({ alert, crudType }) => {
    setSelectedAlert(alert);
    setCrudType(crudType);
    setOpenAlertModificationDialog(true);
  };

  const handleClose = () => {
    setOpenAlertModificationDialog(false);
    setSelectedAlert(getAlertPlaceholder(alertTypeKey));
  }

  const handleEnableClick = ({ alert }) => {
    const currentIsEnabled = alert[AirQualityAlertKeys.is_enabled];
    const newIsEnabled = !currentIsEnabled;

    fetchDataFromURL({
      url: getAlertsApiUrl({
        endpoint: GeneralAPIendpoints.alerts,
        school_id: currentSchoolID,
        alert_id: alert[AirQualityAlertKeys.id]
      }),
      restMethod: RESTmethods.PUT,
      body: {
        ...alert,
        [AirQualityAlertKeys.is_enabled]: newIsEnabled
      }
    }).then((data) => {
      setAlerts(prevAlerts =>
        prevAlerts.map(prevAlert =>
          prevAlert[AirQualityAlertKeys.id] === alert[AirQualityAlertKeys.id] ? data : prevAlert
        )
      );
      enqueueSnackbar(`This alert will be ${newIsEnabled ? "enabled" : "disabled"}`, SnackbarMetadata.success);
    }).catch((error) => {
      enqueueSnackbar(error.message || `There was an error ${newIsEnabled ? "enabling" : "disabling"} this alert, try again!`, SnackbarMetadata.error);
    });
  }

  return (
    <>
      <Stack spacing={2} alignItems="center">
        <Box sx={{ width: "100%", overflowX: 'auto' }}>
          {
            isValidArray(alertsForTable) ?
              (
                <Table size="small" sx={{ my: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ px: 0 }} />

                      <TableCell>
                        {SharedColumnHeader.location}
                      </TableCell>

                      <TableCell>
                        {SharedColumnHeader.dataType}
                      </TableCell>

                      <TableCell>
                        {SharedColumnHeader.selectedDaysOfWeek}
                      </TableCell>

                      <TableCell>
                        {AlertTypes[alertTypeKey]?.tableColumnHeader || ""}
                      </TableCell>

                      <TableCell>
                        {SharedColumnHeader.createdBy}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TransitionGroup component={TableBody}>
                    {isValidArray(alertsForTable) ? alertsForTable.map((alert, index) => (
                      <Grow key={index}>
                        <TableRow
                          sx={{
                            background: alert[AirQualityAlertKeys.id] === selectedAlert[AirQualityAlertKeys.id] && theme.palette.background.NYUpurpleLight,
                            textDecoration: alert[AirQualityAlertKeys.is_enabled] === false ? "line-through" : "none"
                          }}
                        >
                          <TableCell sx={{ px: 0 }}>
                            <Tooltip
                              title={
                                alert[AirQualityAlertKeys.is_allowed_to_modify] === false
                                  ? returnAlertNotModifiableString(alert[AirQualityAlertKeys.owner_role], alert[AirQualityAlertKeys.is_allowed_to_modify])
                                  : `Click to ${alert[AirQualityAlertKeys.is_enabled] ? "disable" : "enable"} alert`
                              }
                            >
                              {/* Wrap <Switch> in a <span> so that <Tooltip> will still display even if it's disabled */}
                              <span
                                onClick={() => {
                                  if (alert[AirQualityAlertKeys.is_allowed_to_modify] === false) {
                                    enqueueSnackbar(
                                      returnAlertNotModifiableString(alert[AirQualityAlertKeys.owner_role], alert[AirQualityAlertKeys.is_allowed_to_modify]),
                                      SnackbarMetadata.warning
                                    );
                                    return;
                                  }
                                  handleEnableClick({ alert });
                                }}
                                style={{ display: 'inline-block' }}
                              >
                                <Switch
                                  size='small'
                                  disabled={alert[AirQualityAlertKeys.is_allowed_to_modify] === false}
                                  checked={alert[AirQualityAlertKeys.is_enabled]}
                                />
                              </span>
                            </Tooltip>

                            <Tooltip
                              title={
                                alert[AirQualityAlertKeys.is_allowed_to_modify] === false
                                  ? returnAlertNotModifiableString(alert[AirQualityAlertKeys.owner_role], alert[AirQualityAlertKeys.is_allowed_to_modify])
                                  : `Edit alert`
                              }
                            >
                              <span
                                onClick={() => {
                                  if (alert[AirQualityAlertKeys.is_allowed_to_modify] === false) {
                                    enqueueSnackbar(
                                      returnAlertNotModifiableString(alert[AirQualityAlertKeys.owner_role], alert[AirQualityAlertKeys.is_allowed_to_modify]),
                                      SnackbarMetadata.warning
                                    );
                                    return;
                                  }
                                  handleModifyClick({ alert, crudType: CrudTypes.edit })
                                }}
                                style={{ display: 'inline-block' }}
                              >
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  disabled={alert[AirQualityAlertKeys.is_allowed_to_modify] === false}
                                  sx={{ "&:hover,:focus": { color: theme.palette.primary.main } }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>

                          <TableCell sx={{ textTransform: 'capitalize' }}>
                            {alert[AirQualityAlertKeys.location_short]}
                          </TableCell>

                          <TableCell>
                            {
                              Object.keys(DataTypes)
                                .filter(key => key === alert[AirQualityAlertKeys.datatypekey])
                                .map(key => DataTypes[key].name_title)[0]
                            }
                          </TableCell>

                          <TableCell>
                            {returnDaysOfWeekString(alert[AirQualityAlertKeys.days_of_week])}
                          </TableCell>

                          {alertTypeKey === AlertTypes.threshold.id ? (
                            <TableCell>
                              {ThresholdAlertTypes[alert[AirQualityAlertKeys.alert_type]].sign}{alert[AirQualityAlertKeys.threshold_value]}
                              &nbsp;
                              {
                                Object.keys(DataTypes)
                                  .filter(key => key === alert[AirQualityAlertKeys.datatypekey])
                                  .map(key => DataTypes[key].unit)[0]
                              }
                            </TableCell>
                          ) : null}

                          {alertTypeKey === AlertTypes.daily.id ? (
                            <TableCell>
                              {returnHoursFromMinutesPastMidnight(alert[AirQualityAlertKeys.minutespastmidnight])}
                            </TableCell>
                          ) : null}

                          <TableCell>
                            <Chip
                              label={
                                returnCreatedByString(
                                  alert[AirQualityAlertKeys.owner_role],
                                  alert[AirQualityAlertKeys.self_is_owner]
                                )
                              }
                              size='small'
                            />
                          </TableCell>
                        </TableRow>
                      </Grow>
                    )) : null
                    }
                  </TransitionGroup>
                </Table>
              ) : (
                <Alert
                  severity='warning'
                  sx={{
                    mt: 2
                  }}>
                  No {AlertTypes[alertTypeKey].name.toLowerCase()} alert has been set up
                </Alert>
              )
          }
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddAlarmIcon />}
          fullWidth
          sx={{ maxWidth: "sm", textTransform: 'uppercase' }}
          onClick={() => handleModifyClick({
            alert: getAlertPlaceholder(alertTypeKey), crudType: CrudTypes.add
          })}
        >
          Add Alert
        </Button>
      </Stack>

      <AlertModificationDialog
        alertTypeKey={alertTypeKey}
        crudType={crudType}
        openAlertModificationDialog={openAlertModificationDialog}
        handleClose={handleClose}
      />
    </>
  );
};

export default AlertsTable;