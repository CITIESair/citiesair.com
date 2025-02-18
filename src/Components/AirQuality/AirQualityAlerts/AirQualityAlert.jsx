import { Stack } from '@mui/material';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import CustomDialog from '../../CustomDialog/CustomDialog';
import EmailsInput from './EmailsInput';
import AlertsTabs from './AlertsTabs';
import { AirQualityAlertProvider } from '../../../ContextProviders/AirQualityAlertContext';
import useLoginHandler from '../../Account/useLoginHandler';

export default function AirQualityAlerts({ onButtonClick }) {
  const { handleRestrictedAccess } = useLoginHandler(onButtonClick);

  return (
    <CustomDialog
      buttonIcon={<NotificationImportantIcon sx={{ fontSize: '1rem' }} />}
      buttonLabel="Alerts"
      dialogTitle="Air quality alerts"
      dialogOpenHandler={(action) => handleRestrictedAccess(action)}
    >
      <Stack width="100%" spacing={5}>
        <AirQualityAlertProvider>
          <AlertsTabs />
        </AirQualityAlertProvider>

        <EmailsInput />
      </Stack>
    </CustomDialog>
  );
}
