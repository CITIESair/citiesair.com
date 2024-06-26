import { useState } from 'react';
import { Box, Button, IconButton, Stack, useMediaQuery, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, ToggleButtonGroup, ToggleButton, Select, FormControl, InputLabel, MenuItem, Alert } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';

import { useTheme } from '@emotion/react';
import { useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';

import AlertTypes from './AlertTypes';
import { ThresholdAlertTypes } from './AlertTypes';

import { isValidArray } from '../../../Utils/Utils';
import AlertModificationDialog from './AlertModificationDialog';

import { returnHoursFromMinutesPastMidnight, CrudTypes, SharedColumnHeader } from './Utils';

const AlertsTable = (props) => {

  const { selectedAlert, setSelectedAlert, setAlerts } = useAirQualityAlert();

  const { alertTypeKey, alertsForTable } = props;

  const theme = useTheme();

  const [openAlertModificationDialog, setOpenAlertModificationDialog] = useState(false);
  const [crudType, setCrudType] = useState(null);

  const handleModifyClick = ({ alert, crudType }) => {
    setSelectedAlert(alert);
    setCrudType(crudType);
    setOpenAlertModificationDialog(true);
  };

  const handleAlertModification = (crudType) => {
    switch (crudType) {
      case CrudTypes.add:

        break;
      case CrudTypes.edit:

        break;
      case CrudTypes.delete:
        // Call DELETE first, then remove these later after 200, if 400, then don't set delete, give alert failed

        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== selectedAlert.id));
        break;
      default:
        break
    }
    setOpenAlertModificationDialog(false);
    setSelectedAlert(null);
  }

  const handleCloseWithoutModification = () => {
    setOpenAlertModificationDialog(false);
    setSelectedAlert(null);
  }

  return (
    <>
      <Stack spacing={2} alignItems="center">
        <Box width="100%">
          <Table size="small" sx={{ my: 1 }}>
            <TableHead >
              <TableRow>
                <TableCell sx={{ width: "5rem", px: 0 }}></TableCell>

                <TableCell sx={{ pl: 1 }}>
                  {SharedColumnHeader.location}
                </TableCell>

                <TableCell>
                  {SharedColumnHeader.dataType}
                </TableCell>

                <TableCell>
                  {AlertTypes[alertTypeKey]?.tableColumnHeader || ""}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isValidArray(alertsForTable) ? alertsForTable.map((alert, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ width: "5rem", px: 0 }}>
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
                  </TableCell>

                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {alert?.location_short}
                  </TableCell>

                  <TableCell>
                    {alert?.datatypekey}
                  </TableCell>

                  {alertTypeKey === AlertTypes.threshold.id ? (
                    <TableCell>
                      {ThresholdAlertTypes[alert?.alert_type].sign}{alert?.alert_threshold}
                    </TableCell>
                  ) : null}

                  {alertTypeKey === AlertTypes.daily.id ? (
                    <TableCell>
                      {returnHoursFromMinutesPastMidnight(alert?.minutespastmidnight)}
                    </TableCell>
                  ) : null}
                </TableRow>
              )) : null
              }
            </TableBody>
          </Table>

          {
            !isValidArray(alertsForTable) ?
              (
                <Alert
                  severity='warning'>
                  No alerts have been set up for this school
                </Alert>
              )
              : null
          }
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddAlarmIcon />}
          fullWidth
          sx={{ maxWidth: "sm" }}
          onClick={() => handleModifyClick({
            alert: null, crudType: CrudTypes.add
          })}
        >
          ADD ALERT
        </Button>
      </Stack>

      <AlertModificationDialog
        selectedAlert={selectedAlert}
        alertTypeKey={alertTypeKey}
        crudType={crudType}
        openAlertModificationDialog={openAlertModificationDialog}
        handleCloseWithoutModification={handleCloseWithoutModification}
        handleAlertModification={handleAlertModification}
      />
    </>
  );
};

export default AlertsTable;