import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PeopleIcon from '@mui/icons-material/People';

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
}

export const UserRolesForLogin = [UserRoles.school, UserRoles.individual];

export const getDashboardLabel = (user, schoolID = null) => {
    const role = user?.user_role;

    switch (role) {
        case UserRoles.individual.id:
            if (user.email) {
                return `My ${schoolID ? schoolID : ''} Dashboard`;
            } else {
                return `Dashboard (${user.email})`;
            }
        default:
            return `${user?.username?.toUpperCase()}'s Dashboard`;
    }
};