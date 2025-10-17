import { onlineManager } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';

export const useNetworkStatus = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        let offlineSnackbarKey = null;

        const unsub = onlineManager.subscribe(() => {
            if (!onlineManager.isOnline()) {
                offlineSnackbarKey = enqueueSnackbar(
                    'You are offline. Real-time data update will not be available.',
                    SnackbarMetadata.offline
                );
            } else {
                if (offlineSnackbarKey) closeSnackbar(offlineSnackbarKey);
                enqueueSnackbar('Back online!', SnackbarMetadata.success);
            }
        });

        return unsub;
    }, [enqueueSnackbar, closeSnackbar]);
};
