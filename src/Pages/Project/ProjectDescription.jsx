import { Skeleton, Typography, useTheme } from "@mui/material";
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from "../../Utils/UtilFunctions";
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";

const ProjectDescription = () => {
    const theme = useTheme();
    const { schoolMetadata } = useContext(DashboardContext);

    if (schoolMetadata) return (
        <Typography
            component="div"
            variant="body1"
            color="text.secondary"
            sx={{
                textAlign: 'justify', pb: 2, mb: 0, "& table *": {
                    color: `${theme.palette.text.secondary}`
                }
            }}
            gutterBottom
        >
            {
                parse(schoolMetadata.description || '', {
                    replace: replacePlainHTMLWithMuiComponents,
                })
            }
        </Typography>
    )
    else {
        return (
            Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant='text' />
            ))
        )
    }
}

export default ProjectDescription;