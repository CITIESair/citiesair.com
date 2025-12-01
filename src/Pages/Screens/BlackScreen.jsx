import { Grid } from "@mui/material"

const BlackScreen = () => {
    return (
        <Grid
            container
            alignContent="stretch"
            alignItems="stretch"
            height="100vh"
            sx={{
                overflow: 'hidden',
                background: "black",
            }}
        />
    )
}

export default BlackScreen; 