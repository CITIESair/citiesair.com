import type { ReactNode } from 'react';

import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PeopleIcon from '@mui/icons-material/People';

export const LoginTypes = {
    google: 'login-google',
    password: 'login-password'
} as const;

export type LoginType = (typeof LoginTypes)[keyof typeof LoginTypes];

export type UserRoleLoginLabels = {
    icon: ReactNode;
    username: string;
    password: string;
};

export type UserRoleDefinition = {
    id: string;
    name: string;
    loginLabels?: UserRoleLoginLabels;
};

export const UserRoles = {
    admin: {
        id: 'admin',
        name: 'CITIESair Admin'
    },
    individual: {
        id: 'individual',
        name: 'Individual User',
        loginLabels: {
            icon: <PeopleIcon />,
            username: 'Email',
            password: 'Password'
        }
    },
    school: {
        id: 'school',
        name: 'Institution Admin',
        loginLabels: {
            icon: <AssuredWorkloadIcon />,
            username: 'Institution ID',
            password: 'Access Code'
        }
    }
} as const satisfies Record<string, UserRoleDefinition>;

export type UserRoleKey = keyof typeof UserRoles;
export type UserRoleId = (typeof UserRoles)[UserRoleKey]['id'];

export const UserRolesForLogin = [UserRoles.school, UserRoles.individual] as const;

export type DashboardLabelUser = {
    user_role?: string | null;
    email?: string | null;
    username?: string | null;
};

export const getDashboardLabel = (user?: DashboardLabelUser | null, schoolID: string | null = null): string => {
    const role = user?.user_role;

    switch (role) {
        case UserRoles.individual.id:
            if (user?.email) {
                return `My ${schoolID ? schoolID : ''} Dashboard`;
            } else {
                return `Dashboard (${user?.email})`;
            }
        default:
            return `${user?.username?.toUpperCase()}'s Dashboard`;
    }
};
