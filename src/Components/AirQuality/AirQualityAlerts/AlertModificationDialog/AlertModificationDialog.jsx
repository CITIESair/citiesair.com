import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import AlertTypes, { ThresholdAlertTypes } from '../AlertTypes';
import { CrudTypes } from '../Utils';

import { AirQualityAlertKeys, getAlertDefaultPlaceholder, useAirQualityAlert } from '../../../../ContextProviders/AirQualityAlertContext';

import { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '../../../../ContextProviders/DashboardContext';
import { fetchDataFromURL } from '../../../../API/ApiFetch';
import { RESTmethods } from "../../../../API/Utils";
import { getAlertsApiUrl } from '../../../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../../../API/Utils";

import { SnackbarMetadata } from '../../../../Utils/SnackbarMetadata';

import isEqual from 'lodash.isequal';
import AlertDeletionDialog from './AlertDeletionDialog';
import { useSnackbar } from 'notistack';

import { DialogData } from './DialogData';
import { AlertPropertyComponents } from './AlertPropertyComponents/AlertPropertyComponents';

const AlertModificationDialog = (props) => {
  const {
    alertTypeKey,
    openAlertModificationDialog,
    crudType,
    handleClose
  } = props;

  const { currentSchoolID } = useContext(DashboardContext);

  const { selectedAlert, setSelectedAlert, editingAlert, setEditingAlert, setAlerts, addChildToAlerts } = useAirQualityAlert();

  const [shouldDisableButton, setShouldDisableButton] = useState(false);

  const { enqueueSnackbar } = useSnackbar()

  const theme = useTheme();

  const sanityCheckAlertBeforeSaving = () => {
    if (alertTypeKey === AlertTypes.daily.id) return { valid: true };

    if (!editingAlert[AirQualityAlertKeys.has_child_alert]) return { valid: true };

    const isAbove = editingAlert[AirQualityAlertKeys.alert_type] === ThresholdAlertTypes.above_threshold.id;
    const threshold = editingAlert[AirQualityAlertKeys.threshold_value];
    const childThreshold = editingAlert[AirQualityAlertKeys.child_alert]?.[AirQualityAlertKeys.threshold_value];

    if (childThreshold === undefined) return { valid: true };

    if (
      (isAbove && threshold <= childThreshold) ||
      (!isAbove && threshold >= childThreshold)
    ) {
      return {
        valid: false,
        message: `The follow-up alert must have a ${isAbove ? "lower" : "higher"} threshold than the first alert`
      };
    }

    return { valid: true };
  };

  const removeChildAlertFromParentAlertBody = (body) => {
    const newBody = { ...body };
    delete newBody[AirQualityAlertKeys.child_alert];
    delete newBody[AirQualityAlertKeys.has_child_alert];
    return newBody;
  }

  const formatChildAlertBody = (body, parent_alert_id) => {
    const newBody = {
      ...body, // copy all properties from parent
      ...body[AirQualityAlertKeys.child_alert], // but then, override with child's unique properties
      [AirQualityAlertKeys.parent_alert_id]: parent_alert_id, // finally, link child to parent
      [AirQualityAlertKeys.id]: null // destroy parent's id just in case
    };
    delete newBody[AirQualityAlertKeys.child_alert];
    delete newBody[AirQualityAlertKeys.has_child_alert];

    return newBody;
  };

  const handleAlertModification = ({ passedCrudType }) => {
    const handleFetchError = (error) => {
      enqueueSnackbar(DialogData[passedCrudType].errorMessage, SnackbarMetadata.error);
    };

    const handleFetchSuccess = () => {
      enqueueSnackbar(DialogData[passedCrudType].successMessage, SnackbarMetadata.success);
      handleClose();
    }

    switch (passedCrudType) {
      case CrudTypes.add: {
        const result = sanityCheckAlertBeforeSaving();
        if (!result.valid) {
          enqueueSnackbar(result.message, SnackbarMetadata.error);
          return;
        }

        // 1. POST to create the main alert (always run)
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID
          }),
          restMethod: RESTmethods.POST,
          body: removeChildAlertFromParentAlertBody(editingAlert)
        }).then((createdAlert) => {
          setAlerts(prevAlerts => {
            const updatedAlerts = [...prevAlerts, createdAlert];
            return addChildToAlerts(updatedAlerts);
          });
          handleFetchSuccess();

          const placeholder = getAlertDefaultPlaceholder(alertTypeKey);
          setSelectedAlert(placeholder);
          setEditingAlert(placeholder);

          // 2. POST for child alert associated with this main alert (only if it exists)
          if (!editingAlert[AirQualityAlertKeys.has_child_alert]) return;

          const parent_alert_id = createdAlert[AirQualityAlertKeys.id];
          if (parent_alert_id === null || parent_alert_id === undefined) return;

          fetchDataFromURL({
            url: getAlertsApiUrl({
              endpoint: GeneralAPIendpoints.alerts,
              school_id: currentSchoolID
            }),
            restMethod: RESTmethods.POST,
            body: formatChildAlertBody(editingAlert, parent_alert_id)
          }).then((createdChildAlert) => {
            setAlerts(prevAlerts => {
              const updatedAlerts = [...prevAlerts, createdChildAlert];
              return addChildToAlerts(updatedAlerts);
            });
          }).catch((childError) => handleFetchError(childError));

        }).catch((error) => handleFetchError(error));

        break;
      }
      case CrudTypes.edit: {
        const result = sanityCheckAlertBeforeSaving();
        if (!result.valid) {
          enqueueSnackbar(result.message, SnackbarMetadata.error);
          return;
        }

        // 1. PUT to modify the main alert (always run)
        const alert_id = selectedAlert[AirQualityAlertKeys.id];
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID,
            alert_id: alert_id
          }),
          restMethod: RESTmethods.PUT,
          body: removeChildAlertFromParentAlertBody(editingAlert)
        }).then((updatedAlert) => {
          setAlerts(prevAlerts => {
            const updatedAlerts = prevAlerts.map(alert =>
              alert.id === alert_id ? updatedAlert : alert
            );
            return addChildToAlerts(updatedAlerts);
          });
          handleFetchSuccess();

          // 2. Editing for child alert associated with this main alert
          const child_alert_id = editingAlert[AirQualityAlertKeys.child_alert]?.[AirQualityAlertKeys.id];
          // 2.1. There should NOT be child alert
          if (!editingAlert[AirQualityAlertKeys.has_child_alert]) {
            // If child alert existed before but now is removed, then trigger deletion
            if (child_alert_id !== null && child_alert_id !== undefined) {
              fetchDataFromURL({
                url: getAlertsApiUrl({
                  endpoint: GeneralAPIendpoints.alerts,
                  school_id: currentSchoolID,
                  alert_id: child_alert_id
                }),
                restMethod: RESTmethods.DELETE
              }).then(() => {
                setAlerts(prevAlerts => {
                  const updatedAlerts = prevAlerts.filter(alert => alert.id !== child_alert_id)
                  return addChildToAlerts(updatedAlerts);
                });
                handleFetchSuccess();
              }).catch((error) => handleFetchError(error));
            }
          }
          // 2.2. There should be child alert
          else {
            // 2.2.1. If there is no child alert id before, create one
            if (child_alert_id === null || child_alert_id === undefined) {
              fetchDataFromURL({
                url: getAlertsApiUrl({
                  endpoint: GeneralAPIendpoints.alerts,
                  school_id: currentSchoolID
                }),
                restMethod: RESTmethods.POST,
                body: formatChildAlertBody(editingAlert, alert_id)
              }).then((createdChildAlert) => {
                setAlerts(prevAlerts => {
                  const updatedAlerts = [...prevAlerts, createdChildAlert];
                  return addChildToAlerts(updatedAlerts);
                });
              }).catch((childError) => handleFetchError(childError));
            }

            // 2.2.2. Else, update that child alert
            else {
              fetchDataFromURL({
                url: getAlertsApiUrl({
                  endpoint: GeneralAPIendpoints.alerts,
                  school_id: currentSchoolID,
                  alert_id: child_alert_id
                }),
                restMethod: RESTmethods.PUT,
                body: formatChildAlertBody(editingAlert, alert_id)
              }).then((updatedChildAlert) => {
                setAlerts(prevAlerts => {
                  const updatedAlerts = prevAlerts.map(alert =>
                    alert.id === child_alert_id ? updatedChildAlert : alert
                  );

                  return addChildToAlerts(updatedAlerts);
                });
              }).catch((childError) => handleFetchError(childError));
            }
          }

        }).catch((error) => handleFetchError(error));

        break;
      }
      case CrudTypes.delete:
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID,
            alert_id: selectedAlert.id
          }),
          restMethod: RESTmethods.DELETE
        }).then(() => {
          setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== selectedAlert.id));
          handleFetchSuccess();
        }).catch((error) => handleFetchError(error));

        break;
      default:
        break;
    }
  }

  // Disable / Enable save button depends on context
  useEffect(() => {
    // startTime cannot be larger than endTime
    if (editingAlert[AirQualityAlertKeys.time_range]?.[0] > editingAlert[AirQualityAlertKeys.time_range]?.[1]) {
      setShouldDisableButton(true);
      return;
    }

    switch (crudType) {
      case CrudTypes.add:
        const placeholder = getAlertDefaultPlaceholder(alertTypeKey);

        if (editingAlert[AirQualityAlertKeys.sensor_id] === placeholder[AirQualityAlertKeys.sensor_id] ||
          editingAlert[AirQualityAlertKeys.datatypekey] === placeholder[AirQualityAlertKeys.datatypekey]) {
          if (alertTypeKey === AlertTypes.daily.id) {
            setShouldDisableButton(editingAlert[AirQualityAlertKeys.minutespastmidnight] === placeholder[AirQualityAlertKeys.minutespastmidnight]);
          } else {
            setShouldDisableButton(true);
          }
        } else {
          if (alertTypeKey === AlertTypes.daily.id) {
            setShouldDisableButton(editingAlert[AirQualityAlertKeys.minutespastmidnight] === placeholder[AirQualityAlertKeys.minutespastmidnight]);
          } else {
            setShouldDisableButton(false);
          }
        }
        break;

      case CrudTypes.edit:
        // Case empty editing value
        let alertVal;
        if (alertTypeKey === AlertTypes.daily.id) {
          alertVal = editingAlert[AirQualityAlertKeys.minutespastmidnight]
        } else {
          alertVal = editingAlert[AirQualityAlertKeys.threshold_value]
        }
        const datatypeKeyVal = editingAlert[AirQualityAlertKeys.datatypekey];

        if (!alertVal || alertVal === '' || !datatypeKeyVal || datatypeKeyVal === '') {
          setShouldDisableButton(true);
          break;
        }

        setShouldDisableButton(isEqual(selectedAlert, editingAlert));
        break;
      default:
        setShouldDisableButton(false);
        break;
    }
  }, [crudType, selectedAlert, editingAlert, alertTypeKey]);

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Dialog
      open={openAlertModificationDialog}
      onClose={handleClose}
      aria-labelledby="alert-modification-dialog"
      maxWidth="md"
      fullWidth
      fullScreen={smallScreen}
    >
      <DialogTitle id="alert-modification-dialog">
        {DialogData[crudType]?.title}
      </DialogTitle>

      <DialogContent>
        <AlertPropertyComponents
          alertTypeKey={alertTypeKey}
          crudType={crudType}
        />
      </DialogContent>
      <DialogActions sx={{
        justifyContent: "space-between"
      }}>
        {
          crudType === CrudTypes.edit ? (
            <AlertDeletionDialog
              onConfirmedDelete={() => {
                handleAlertModification({ passedCrudType: CrudTypes.delete })
              }}
            />
          ) : null
        }

        <Stack direction="row" width="100%" justifyContent="end">
          <Button
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAlertModification({ passedCrudType: crudType });
            }}
            color="primary"
            disabled={shouldDisableButton}
          >
            Save Edit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModificationDialog;


