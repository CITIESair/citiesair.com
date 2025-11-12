import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';

const NetworkStatusContext = createContext();

export const NetworkStatusProvider = ({ children }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [isDeviceOnline, setIsDeviceOnline] = useState(true);
    const [isServerDown, setIsServerDown] = useState(false);

    // --- Device network status handler ---
    useEffect(() => {
        let offlineSnackbarKey = null;

        const unsub = onlineManager.subscribe(() => {
            const online = onlineManager.isOnline();
            setIsDeviceOnline(online);

            if (!online) {
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

    // --- Server availability handler ---
    useEffect(() => {
        let serverDownSnackbarKey = null;

        const handleServerDown = () => {
            setIsServerDown(true);
            if (serverDownSnackbarKey) return;
            serverDownSnackbarKey = enqueueSnackbar(
                'Server temporarily unavailable',
                SnackbarMetadata.offline
            );
        };

        const handleServerUp = () => {
            setIsServerDown(false);
            if (serverDownSnackbarKey) {
                closeSnackbar(serverDownSnackbarKey);
                serverDownSnackbarKey = null;
                enqueueSnackbar('Connection to server restored', SnackbarMetadata.success);
            }
        };

        window.addEventListener('server:down', handleServerDown);
        window.addEventListener('server:up', handleServerUp);

        return () => {
            window.removeEventListener('server:down', handleServerDown);
            window.removeEventListener('server:up', handleServerUp);
        };
    }, [enqueueSnackbar, closeSnackbar]);

    const providerValue = useMemo(() => ({
        isDeviceOnline, setIsDeviceOnline,
        isServerDown, setIsServerDown
    }), [isDeviceOnline, isServerDown]);

    return (
        <NetworkStatusContext.Provider value={providerValue}>
            {children}
        </NetworkStatusContext.Provider>
    );
};

export const useNetworkStatusContext = () => useContext(NetworkStatusContext);
