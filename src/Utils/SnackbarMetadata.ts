import { OptionsObject } from 'notistack';

interface SnackbarMetadataType {
    info: OptionsObject;
    warning: OptionsObject;
    error: OptionsObject;
    success: OptionsObject;
    offline: OptionsObject;
}

export const SnackbarMetadata: SnackbarMetadataType = {
    info: {
        variant: 'info',
        autoHideDuration: 10000
    },
    warning: {
        variant: 'warning',
        autoHideDuration: 10000
    },
    error: {
        variant: 'error',
        autoHideDuration: 10000
    },
    success: {
        variant: 'success',
        autoHideDuration: 3000
    },
    offline: {
        variant: 'warning',
        persist: true
    }
};
