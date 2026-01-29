export type SnackbarVariant = 'info' | 'warning' | 'error' | 'success';

interface SnackbarConfig {
    variant: SnackbarVariant;
    duration?: number;
    persist?: boolean;
}

interface SnackbarMetadataType {
    info: SnackbarConfig;
    warning: SnackbarConfig;
    error: SnackbarConfig;
    success: SnackbarConfig;
    offline: SnackbarConfig;
}

export const SnackbarMetadata: SnackbarMetadataType = {
    info: {
        variant: 'info',
        duration: 10000
    },
    warning: {
        variant: 'warning',
        duration: 10000
    },
    error: {
        variant: 'error',
        duration: 10000
    },
    success: {
        variant: 'success',
        duration: 3000
    },
    offline: {
        variant: 'warning',
        persist: true
    }
};
