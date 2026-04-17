import type { ReactNode } from 'react';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PeopleIcon from '@mui/icons-material/People';

export interface AllowedSchool {
    school_id: string;
    name: string;
    sorting_id: number | null;
}

// To be harmonized with backend's openapi doc?
export interface UserData {
    authenticated: boolean;
    allowedSchools: AllowedSchool[];
    username: string | null;
    email: string | null;
    is_verified: boolean;
    user_role: UserRoleKey | null;
    recently_registered?: boolean;
    message?: string;
}

export const EMPTY_USER_DATA: UserData = {
    authenticated: false,
    allowedSchools: [],
    username: null,
    email: null,
    is_verified: false,
    user_role: null
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