import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import { useContext } from 'react';
import { UserContext } from '../../ContextProviders/UserContext';

const UserTypeSelector = () => {
    const { isSchoolForLogin, setIsSchoolForLogin } = useContext(UserContext);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            my={2}
        >
            <ToggleButtonGroup
                color="primary"
                exclusive
                value={isSchoolForLogin}
                onChange={(_, value) => {
                    if (value !== null) {
                        setIsSchoolForLogin(value);
                    }
                }}
                sx={{
                    width: '100%'
                }}
            >
                <ToggleButton
                    value={true}
                    sx={{
                        width: '50%',
                        flexDirection: 'column',
                        py: 3
                    }}
                >
                    <SchoolIcon fontSize="large" />
                    <Typography
                        sx={{ typography: { sm: 'h6', xs: 'body1' } }}
                        mt={1}
                    >
                        School Admin<br />
                    </Typography>
                </ToggleButton>
                <ToggleButton
                    value={false}
                    sx={{
                        width: '50%',
                        flexDirection: 'column',
                        py: 3
                    }}
                >
                    <PeopleIcon fontSize="large" />
                    <Typography
                        sx={{ typography: { sm: 'h6', xs: 'body1' } }}
                        mt={1}
                    >
                        NYUAD Community
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default UserTypeSelector;