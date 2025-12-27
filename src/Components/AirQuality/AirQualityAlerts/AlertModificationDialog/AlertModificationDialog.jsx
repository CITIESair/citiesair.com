import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import AlertTypes, { ThresholdAlertTypes } from '../AlertTypes';
import { AirQualityAlertKeys, CrudTypes, getAlertDefaultPlaceholder } from '../AlertUtils';
import { useContext, useEffect, useState } from 'react';
import { SnackbarMetadata } from '../../../../Utils/SnackbarMetadata';
import isEqual from 'lodash.isequal';
import AlertDeletionDialog from './AlertDeletionDialog';
import { useSnackbar } from 'notistack';
import { DialogData } from './DialogData';
import { AlertPropertyComponents } from './AlertPropertyComponents/AlertPropertyComponents';
import { useCreateAlertMutation } from '../../../../hooks/alerts/useCreateAlertMutation';
import { useEditAlertMutation } from '../../../../hooks/alerts/useEditAlertMutation';
import { useDeleteAlertMutation } from '../../../../hooks/alerts/useDeleteAlertMutation';
import { AirQualityAlertContext } from '../../../../ContextProviders/AirQualityAlertContext';

const AlertModificationDialog = (props) => {
  const {
    alertTypeKey,
    openAlertModificationDialog,
    crudType,
    handleClose
  } = props;

  const { selectedAlert, setSelectedAlert, editingAlert, setEditingAlert } = useContext(AirQualityAlertContext);

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

  const formatChildAlertBody = ({ body, parent_alert_id, this_alert_id }) => {
    const newBody = {
      ...body, // copy all properties from parent
      ...body[AirQualityAlertKeys.child_alert], // but then, override with child's unique properties
      [AirQualityAlertKeys.parent_alert_id]: parent_alert_id, // finally, link child to parent
      [AirQualityAlertKeys.id]: this_alert_id || null
    };
    delete newBody[AirQualityAlertKeys.child_alert];
    delete newBody[AirQualityAlertKeys.has_child_alert];

    return newBody;
  };

  const handleSuccess = (passedCrudType) => {
    enqueueSnackbar(DialogData[passedCrudType].successMessage, SnackbarMetadata.success);
    handleClose();
  }
  const handleError = (passedCrudType) => {
    enqueueSnackbar(DialogData[passedCrudType].errorMessage, SnackbarMetadata.error);
  };

  const handleAlertModification = ({ passedCrudType }) => {
    const result = sanityCheckAlertBeforeSaving();
    if (!result.valid) {
      enqueueSnackbar(result.message, SnackbarMetadata.error);
      return;
    }

    switch (passedCrudType) {
      case CrudTypes.add: {
        // 1. POST to create the main alert (always run)
        createAlertMutation.mutate(
          {
            alertToCreate: removeChildAlertFromParentAlertBody(editingAlert)
          },
          {
            onSuccess: (createdAlert) => {
              handleSuccess(passedCrudType);

              // 2. POST for child alert associated with this main alert (only if it exists)
              // Child alerts only apply to threshold alerts, daily alerts don't have child
              if (selectedAlert[AirQualityAlertKeys.alert_type] === AlertTypes.daily.id) return;

              const placeholder = getAlertDefaultPlaceholder(alertTypeKey);
              setSelectedAlert(placeholder);
              setEditingAlert(placeholder);

              if (!editingAlert[AirQualityAlertKeys.has_child_alert]) return;
              const parent_alert_id = createdAlert[AirQualityAlertKeys.id];
              if (parent_alert_id === null || parent_alert_id === undefined) return;

              createAlertMutation.mutate(
                {
                  alertToCreate: formatChildAlertBody({
                    body: editingAlert,
                    parent_alert_id
                  })
                },
                {
                  onError: () => handleError(passedCrudType)
                }
              );
            }
          }
        );
        break;
      }
      case CrudTypes.edit: {
        // 1. PUT to modify the main alert (always run)
        const alert_id = selectedAlert[AirQualityAlertKeys.id];

        editAlertMutation.mutate(
          {
            alertId: alert_id,
            alertToEdit: removeChildAlertFromParentAlertBody(editingAlert)
          },
          {
            onSuccess: () => {
              handleSuccess(passedCrudType);

              // 2. Editing for child alert associated with this main alert
              // Child alerts only apply to threshold alerts, daily alerts don't have child
              if (selectedAlert[AirQualityAlertKeys.alert_type] === AlertTypes.daily.id) return;

              const child_alert_id = editingAlert[AirQualityAlertKeys.child_alert]?.[AirQualityAlertKeys.id];
              // 2.1. There should NOT be child alert
              // (If child alert existed before but now is removed, then trigger deletion)
              if (!editingAlert[AirQualityAlertKeys.has_child_alert] &&
                child_alert_id !== null && child_alert_id !== undefined
              ) {
                deleteAlertMutation.mutate(
                  { alertId: child_alert_id },
                  {
                    onSuccess: () => handleSuccess(CrudTypes.delete),
                    onError: () => handleError(CrudTypes.delete)
                  }
                );
              }
              // 2.2. There should be child alert
              else {
                // 2.2.1. If there is no child alert id before, create one
                if (child_alert_id === null || child_alert_id === undefined) {
                  const formattedChildAlert = formatChildAlertBody({
                    body: editingAlert,
                    parent_alert_id: alert_id
                  });

                  createAlertMutation.mutate({
                    alertId: alert_id,
                    alertToCreate: formattedChildAlert
                  });
                }
                // 2.2.2. Else, update that child alert
                else {
                  const formattedChildAlert = formatChildAlertBody({
                    body: editingAlert,
                    parent_alert_id: alert_id,
                    this_alert_id: child_alert_id
                  });

                  editAlertMutation.mutate({
                    alertId: child_alert_id,
                    alertToEdit: formattedChildAlert
                  })
                }
              }
            }
          }
        )
        break;
      }
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

  const createAlertMutation = useCreateAlertMutation();
  const editAlertMutation = useEditAlertMutation();
  const deleteAlertMutation = useDeleteAlertMutation();

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
                // Only need one API call to delete the main alert
                // any associated child alert will be automatically deleted by database (cascade delete)
                deleteAlertMutation.mutate(
                  { alertId: selectedAlert.id },
                  {
                    onSuccess: () => handleSuccess(CrudTypes.delete),
                    onError: () => handleError(CrudTypes.delete)
                  }
                );
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


