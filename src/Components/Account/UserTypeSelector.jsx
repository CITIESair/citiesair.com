import { Box, ToggleButtonGroup, ToggleButton, Typography, Stack, useTheme } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import { useContext } from 'react';
import { UserContext } from '../../ContextProviders/UserContext';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';
import sectionData from '../../section_data.json';
import { AppRoutes } from '../../Utils/AppRoutes';

const UserTypeSelector = ({ route = AppRoutes.login }) => {
    const { isSchoolForLogin, setIsSchoolForLogin } = useContext(UserContext);
    const theme = useTheme();

    const getLabelContent = () => {
        const cleanedRoute = route.startsWith('/') ? route.slice(1) : route;
        const content = sectionData[cleanedRoute]?.content;

        if (content) {
            switch (isSchoolForLogin) {
                case true:
                    return content.school;
                default:
                    return content.nyuad;
            }
        }
        else { return null };

    };

    return (
        <Stack direction="column" gap={3}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
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
                            <Box fontWeight={500}>School Admin</Box>
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
                            <Box fontWeight={500}>NYUAD Community</Box>
                        </Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Typography
                sx={{
                    pl: 1,
                    borderLeftColor: theme.palette.primary.main,
                    borderLeftWidth: "2px",
                    borderLeftStyle: "solid"
                }}
                color="text.secondary"
                fontStyle="italic"
            >
                {
                    parse(getLabelContent(), {
                        replace: replacePlainHTMLWithMuiComponents,
                    })
                }
            </Typography>
        </Stack>
    );
};

export default UserTypeSelector;