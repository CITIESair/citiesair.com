export const LoginTypes = {
    google: 'login-google',
    password: 'login-password'
}

export const UserRoles = {
    admin: {
        id: 'admin',
        name: 'CITIESair Admin'
    },
    individual: {
        id: 'individual',
        name: 'Individual User'
    },
    school: {
        id: 'school',
        name: 'School Admin'
    }
}

export const getDashboardLabel = (user, schoolID = null) => {
    const role = user?.user_role;

    switch (role) {
        case UserRoles.individual.id:
            if (user.email) {
                return `My ${schoolID ? schoolID : ""} Dashboard`;
            } else {
                return `Dashboard (${user.email})`;
            }
        default:
            return `${user?.username?.toUpperCase()}'s Dashboard`;
    }
};