import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import AlertTypes from '../AlertTypes';
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

  const { selectedAlert, setSelectedAlert, editingAlert, setEditingAlert, setAlerts } = useAirQualityAlert();

  const [shouldDisableButton, setShouldDisableButton] = useState(false);

  const { enqueueSnackbar } = useSnackbar()

  const theme = useTheme();

  const handleAlertModification = ({ passedCrudType }) => {
    const handleFetchError = (error) => {
      enqueueSnackbar(DialogData[passedCrudType].errorMessage, SnackbarMetadata.error);
    };

    const handleFetchSuccess = () => {
      enqueueSnackbar(DialogData[passedCrudType].successMessage, SnackbarMetadata.success);
      handleClose();
    }

    switch (passedCrudType) {
      case CrudTypes.add:
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID
          }),
          restMethod: RESTmethods.POST,
          body: editingAlert
        }).then((data) => {
          setAlerts(prevAlerts => [...prevAlerts, data]);
          handleFetchSuccess();

          const placeholder = getAlertDefaultPlaceholder(alertTypeKey);
          setSelectedAlert(placeholder);
          setEditingAlert(placeholder);
        }).catch((error) => handleFetchError(error));

        break;
      case CrudTypes.edit:
        const alert_id = selectedAlert[AirQualityAlertKeys.id];
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID,
            alert_id: alert_id
          }),
          restMethod: RESTmethods.PUT,
          body: editingAlert
        }).then((data) => {
          setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
              alert.id === alert_id ? data : alert
            )
          );
          handleFetchSuccess();
        }).catch((error) => handleFetchError(error));

        break;
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
        const val = editingAlert[AirQualityAlertKeys.threshold_value];
        const datatypeKeyVal = editingAlert[AirQualityAlertKeys.datatypekey];
        if (!val || val === '' || !datatypeKeyVal || datatypeKeyVal === '') {
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

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={openAlertModificationDialog}
      onClose={handleClose}
      aria-labelledby="alert-modification-dialog"
      maxWidth="xs"
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


