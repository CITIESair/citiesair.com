export interface UserData {
    authenticated: boolean;
    allowedSchools: string[];
    username: string | null;
    email: string | null;
    is_verified: boolean;
}

export const EMPTY_USER_DATA: UserData = {
    authenticated: false,
    allowedSchools: [],
    username: null,
    email: null,
    is_verified: false
};
