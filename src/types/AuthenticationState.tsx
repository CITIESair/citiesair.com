export type AuthenticationState = {
    checkedAuthentication: boolean;
    authenticated: boolean;
};

export const defaultAuthenticationState: AuthenticationState = {
    checkedAuthentication: false,
    authenticated: false,
};

export const successfulAuthenticationState: AuthenticationState = {
    checkedAuthentication: true,
    authenticated: true,
};

export const failedAuthenticationState: AuthenticationState = {
    checkedAuthentication: true,
    authenticated: false,
};