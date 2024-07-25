import { useState } from 'react';
import { Box, Button, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Alert, Grow } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
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

const AlertsTable = (props) => {

  const { selectedAlert, setSelectedAlert } = useAirQualityAlert();

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

  return (
    <>
      <Stack spacing={2} alignItems="center">
        <Box width="100%">
          {
            isValidArray(alertsForTable) ?
              (
                <Table size="small" sx={{ my: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ pl: 1 }}>
                        {SharedColumnHeader.location}
                      </TableCell>

                      <TableCell>
                        {SharedColumnHeader.dataType}
                      </TableCell>

                      <TableCell>
                        {AlertTypes[alertTypeKey]?.tableColumnHeader || ""}
                      </TableCell>

                      <TableCell sx={{ width: "5rem", px: 0 }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TransitionGroup component={TableBody}>
                    {isValidArray(alertsForTable) ? alertsForTable.map((alert, index) => (
                      <Grow key={index}>
                        <TableRow
                          sx={{
                            background: alert?.id === selectedAlert?.id && theme.palette.background.NYUpurpleLight
                          }}
                        >
                          <TableCell sx={{ textTransform: 'capitalize' }}>
                            {alert?.[AirQualityAlertKeys.location_short]}
                          </TableCell>

                          <TableCell>
                            {
                              Object.keys(DataTypes)
                                .filter(key => key === alert?.[AirQualityAlertKeys.datatypekey])
                                .map(key => DataTypes[key].name_title)[0]
                            }
                          </TableCell>

                          {alertTypeKey === AlertTypes.threshold.id ? (
                            <TableCell>
                              {ThresholdAlertTypes[alert?.alert_type].sign}{alert?.threshold_value}
                              &nbsp;
                              {
                                Object.keys(DataTypes)
                                  .filter(key => key === alert?.[AirQualityAlertKeys.datatypekey])
                                  .map(key => DataTypes[key].unit)[0]
                              }
                            </TableCell>
                          ) : null}

                          {alertTypeKey === AlertTypes.daily.id ? (
                            <TableCell>
                              {returnHoursFromMinutesPastMidnight(alert?.minutespastmidnight)}
                            </TableCell>
                          ) : null}

                          <TableCell sx={{ width: "5rem", px: 0 }}>
                            <Tooltip title="Edit Alert">
                              <IconButton
                                aria-label="edit"
                                size="small"
                                sx={{ "&:hover,:focus": { color: theme.palette.primary.main } }}
                                onClick={() => handleModifyClick({ alert, crudType: CrudTypes.edit })}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Alert">
                              <IconButton
                                aria-label="delete"
                                size="small"
                                sx={{ "&:hover,:focus": { color: theme.palette.primary.main } }}
                                onClick={() => handleModifyClick({ alert, crudType: CrudTypes.delete })}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
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