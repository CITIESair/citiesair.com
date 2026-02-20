import { createContext, useContext, useEffect, useMemo, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';

type NetworkStatusContextValue = {
    isDeviceOnline: boolean;
    setIsDeviceOnline: Dispatch<SetStateAction<boolean>>;
    isServerDown: boolean;
    setIsServerDown: Dispatch<SetStateAction<boolean>>;
};

const NetworkStatusContext = createContext<NetworkStatusContextValue | undefined>(undefined);

export const NetworkStatusProvider = ({ children }: { children: ReactNode }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [isDeviceOnline, setIsDeviceOnline] = useState<boolean>(true);
    const [isServerDown, setIsServerDown] = useState<boolean>(false);

    // --- Device network status handler ---
    useEffect(() => {
        let offlineSnackbarKey: string | number | null = null;

        const unsub = onlineManager.subscribe(() => {
            const online = onlineManager.isOnline();
            setIsDeviceOnline(online);

            if (!online) {
                offlineSnackbarKey = enqueueSnackbar(
                    'You are offline. Real-time data update will not be available.',
                    SnackbarMetadata.offline
                );
            } else {
                if (offlineSnackbarKey != null) closeSnackbar(offlineSnackbarKey as any);
                enqueueSnackbar('Back online!', SnackbarMetadata.success);
            }
        });

        return unsub;
    }, [enqueueSnackbar, closeSnackbar]);

    // --- Server availability handler ---
    useEffect(() => {
        let serverDownSnackbarKey: string | number | null = null;

        const handleServerDown = (e?: Event) => {
            setIsServerDown(true);
            if (serverDownSnackbarKey) return;
            serverDownSnackbarKey = enqueueSnackbar(
                'Server temporarily unavailable',
                SnackbarMetadata.offline
            );
        };

        const handleServerUp = (e?: Event) => {
            setIsServerDown(false);
            if (serverDownSnackbarKey) {
                closeSnackbar(serverDownSnackbarKey as any);
                serverDownSnackbarKey = null;
                enqueueSnackbar('Connection to server restored', SnackbarMetadata.success);
            }
        };

        window.addEventListener('server:down', handleServerDown as EventListener);
        window.addEventListener('server:up', handleServerUp as EventListener);

        return () => {
            window.removeEventListener('server:down', handleServerDown as EventListener);
            window.removeEventListener('server:up', handleServerUp as EventListener);
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

export const useNetworkStatus = (): NetworkStatusContextValue => {
    const ctx = useContext(NetworkStatusContext);
    if (!ctx) throw new Error('useNetworkStatus must be used within NetworkStatusProvider');
    return ctx;
};