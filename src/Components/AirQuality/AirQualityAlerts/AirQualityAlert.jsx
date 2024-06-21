import { useState, useEffect, useContext } from 'react';
import { Box, Link, Typography, Stack, Select, FormControl, MenuItem, Grid, Chip, Dialog, Button, DialogActions, DialogContent, useMediaQuery, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import * as Tracking from '../../../Utils/Tracking';

import { DashboardContext } from '../../../ContextProviders/DashboardContext';

import CustomDialog from '../../CustomDialog/CustomDialog';
import EmailsInput from './EmailsInput';
import AlertsTabs from './AlertsTabs';
import { AirQualityAlertProvider } from '../../../ContextProviders/AirQualityAlertContext';


export default function AirQualityAlerts(props) {
  const { schoolContactEmail } = props;

  const { currentSchoolID } = useContext(DashboardContext);

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