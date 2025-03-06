import { Stack, Typography } from '@mui/material';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import CustomDialog from '../../CustomDialog/CustomDialog';
import EmailsInput from './EmailsInput';
import AlertsTabs from './AlertsTabs';
import { AirQualityAlertProvider } from '../../../ContextProviders/AirQualityAlertContext';
import useLoginHandler from '../../Account/useLoginHandler';
import { useContext } from 'react';
import { UserContext } from '../../../ContextProviders/UserContext';
import { UserRoles } from '../../Account/Utils';


export default function AirQualityAlerts({ onButtonClick }) {
  const { handleRestrictedAccess } = useLoginHandler(onButtonClick);

  const { user } = useContext(UserContext);

  const isModifiable = [UserRoles.admin, UserRoles.school].includes(user?.user_role);

  return (
    <CustomDialog
      buttonIcon={<NotificationImportantIcon sx={{ fontSize: '1rem' }} />}
      buttonLabel="Alerts"
      dialogTitle="Air quality alerts"
      dialogOpenHandler={(action) => handleRestrictedAccess(action)}
    >
      <Stack width="100%" spacing={isModifiable ? 5 : 2}>
        <AirQualityAlertProvider>
          <AlertsTabs />
        </AirQualityAlertProvider>

        {isModifiable ? <EmailsInput /> : (
          <Typography variant="body2" color="text.secondary">
            Alerts will be sent to your email address: <b>{user?.email}</b>
          </Typography>
        )}
      </Stack>
    </CustomDialog>
  );
}
