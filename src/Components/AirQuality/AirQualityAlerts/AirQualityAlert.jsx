import { Stack } from '@mui/material';

import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import * as Tracking from '../../../Utils/Tracking';

import CustomDialog from '../../CustomDialog/CustomDialog';
import EmailsInput from './EmailsInput';
import AlertsTabs from './AlertsTabs';
import { AirQualityAlertProvider } from '../../../ContextProviders/AirQualityAlertContext';

export default function AirQualityAlerts(props) {
  const { schoolContactEmail } = props;

  return (
    <CustomDialog
      buttonIcon={<NotificationImportantIcon sx={{ fontSize: '1rem' }} />}
      buttonLabel="Alerts"
      trackingEvent={Tracking.Events.rawDatasetButtonClicked}
      dialogTitle="Air quality alerts"
    >
      <Stack width="100%" spacing={5}>
        <AirQualityAlertProvider>
          <AlertsTabs />
        </AirQualityAlertProvider>

        <EmailsInput schoolContactEmail={schoolContactEmail} />
      </Stack>

    </CustomDialog>
  );
}