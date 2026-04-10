import { type UserData, type UserRoleKey } from '../../types/UserData';

export const LoginTypes = {
    google: 'login-google',
    password: 'login-password'
} as const;

export type LoginType = (typeof LoginTypes)[keyof typeof LoginTypes];

// Base authentication message types using inheritance
interface BaseAuthMessage {
    type: LoginType;
    success: boolean;
}

export interface AuthSuccessMessage extends BaseAuthMessage {
    success: true;
    user: UserData;
}

export interface AuthFailureMessage extends BaseAuthMessage {
    success: false;
    errorMessage: string;
}

export type AuthMessage = AuthSuccessMessage | AuthFailureMessage;

// Type guards
export const isAuthMessage = (data: unknown): data is AuthMessage => {
    if (!data || typeof data !== "object") return false;
    const maybe = data as { type?: unknown; success?: unknown };
    return (
        (maybe.type === LoginTypes.google || maybe.type === LoginTypes.password) &&
        typeof maybe.success === "boolean"
    );
};

// Array of role keys that can be used for login
export const UserRoleKeysForLogin = ['school', 'individual'] as const satisfies readonly UserRoleKey[];
export type UserRoleKeyForLogin = (typeof UserRoleKeysForLogin)[number];

export const getDashboardLabel = (user: UserData, schoolID: string | null = null): string => {
    const role = user.user_role;

    switch (role) {
        case 'individual':
            if (user?.email) {
                return `My ${schoolID ? schoolID : ''} Dashboard`;
            } else {
                return `Dashboard (${user?.email})`;
            }
        default:
            return `${user?.username?.toUpperCase()}'s Dashboard`;
    }
};
