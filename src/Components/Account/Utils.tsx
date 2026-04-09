import type { ReactNode } from 'react';

import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PeopleIcon from '@mui/icons-material/People';

import type { UserData } from '../../types/UserData';

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

export type UserRoleLoginLabels = {
    icon: ReactNode;
    username: string;
    password: string;
};

export type UserRoleDefinition = {
    name: string;
    loginLabels?: UserRoleLoginLabels;
};

export const UserRoles = {
    admin: {
        name: 'CITIESair Admin'
    },
    individual: {
        name: 'Individual User',
        loginLabels: {
            icon: <PeopleIcon />,
            username: 'Email',
            password: 'Password'
        }
    },
    school: {
        name: 'Institution Admin',
        loginLabels: {
            icon: <AssuredWorkloadIcon />,
            username: 'Institution ID',
            password: 'Access Code'
        }
    }
} as const satisfies Record<string, UserRoleDefinition>;

export type UserRoleKey = keyof typeof UserRoles;
export type UserRoleId = UserRoleKey;

// Array of role keys that can be used for login
export const UserRoleKeysForLogin = ['school', 'individual'] as const satisfies readonly UserRoleKey[];

// Helper to get login labels by user role ID
export const getLoginLabels = (userRoleId: UserRoleId): UserRoleLoginLabels | undefined => {
    const role = UserRoles[userRoleId as UserRoleKey];
    return role && 'loginLabels' in role ? role.loginLabels : undefined;
};

export type DashboardLabelUser = {
    user_role?: string | null;
    email?: string | null;
    username?: string | null;
};

export const getDashboardLabel = (user?: DashboardLabelUser | null, schoolID: string | null = null): string => {
    const role = user?.user_role;

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
