import { Button } from "@mui/material";
import { useTheme } from '@emotion/react';
import { AppRoutes } from '../../../Utils/AppRoutes';

const svgs = {
    light: 'images/oauth/google/web_light_sq_ctn.svg',
    dark: 'images/oauth/google/web_dark_sq_ctn.svg'
}

export default function GoogleOAuthButton() {
    const theme = useTheme();
    const currentSvg = theme.palette.mode === 'dark' ? svgs.dark : svgs.light;

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=205604064780-1jsjqcvf6isv0up6v29c42uvdigb0pbp.apps.googleusercontent.com&redirect_uri=${window.location.origin}${AppRoutes.googleCallback}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline&prompt=consent`;

    return (
        <Button
            fullWidth
            variant="outlined"
            sx={{
                p: 0
            }}
            href={googleOAuthUrl}
        >
            <img src={currentSvg} alt="Google OAuth Button" />
        </Button>

    );
}