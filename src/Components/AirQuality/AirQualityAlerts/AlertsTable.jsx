import { useContext, useState } from 'react';
import { Box, Button, IconButton, Stack, useMediaQuery, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, ToggleButtonGroup, ToggleButton, Select, FormControl, InputLabel, MenuItem, Alert, Collapse, Fade, Slide, Grow } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';

import { useTheme } from '@emotion/react';
import { emptySelectedAlert, useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';

import AlertTypes from './AlertTypes';
import { ThresholdAlertTypes } from './AlertTypes';

import { isValidArray } from '../../../Utils/Utils';
import AlertModificationDialog from './AlertModificationDialog/AlertModificationDialog';

import { returnHoursFromMinutesPastMidnight, CrudTypes, SharedColumnHeader } from './Utils';
import { TransitionGroup } from 'react-transition-group';

const AlertsTable = (props) => {

  const { selectedAlert, setSelectedAlert, editingAlert, setAlerts } = useAirQualityAlert();

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
    setSelectedAlert(emptySelectedAlert);
  }

  return (
    <>
      <Stack spacing={2} alignItems="center">
        <Box width="100%">
          <Table size="small" sx={{ my: 1 }}>
            <TableHead>
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

            <TransitionGroup component={TableBody}>
              {isValidArray(alertsForTable) ? alertsForTable.map((alert, index) => (
                <Grow key={index}>
                  <TableRow
                    sx={{
                      background: alert?.id === selectedAlert?.id && theme.palette.background.NYUpurpleLight
                    }}
                  >
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
                        {ThresholdAlertTypes[alert?.alert_type].sign}{alert?.threshold_value}
                      </TableCell>
                    ) : null}

                    {alertTypeKey === AlertTypes.daily.id ? (
                      <TableCell>
                        {returnHoursFromMinutesPastMidnight(alert?.minutespastmidnight)}
                      </TableCell>
                    ) : null}
                  </TableRow>
                </Grow>

              )) : null
              }
            </TransitionGroup>
          </Table>

          {
            !isValidArray(alertsForTable) ?
              (
                <Alert
                  severity='warning'>
                  No {AlertTypes[alertTypeKey].name} have been set up for this school
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
        alertTypeKey={alertTypeKey}
        crudType={crudType}
        openAlertModificationDialog={openAlertModificationDialog}
        handleClose={handleClose}
      />
    </>
  );
};

export default AlertsTable;