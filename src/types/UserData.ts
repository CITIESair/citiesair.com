// To be harmonized with backend's openapi doc?
export interface UserData {
    authenticated: boolean;
    allowedSchools: string[];
    username: string | null;
    email: string | null;
    is_verified: boolean;
    recently_registered?: boolean;
    message?: string;
}

export const EMPTY_USER_DATA: UserData = {
    authenticated: false,
    allowedSchools: [],
    username: null,
    email: null,
    is_verified: false
};
