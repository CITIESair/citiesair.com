import { Skeleton, Typography, useTheme } from "@mui/material";
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from "../../Utils/UtilFunctions";
import useSchoolMetadata from "../../hooks/useSchoolMetadata";

const ugandaDescription: string = `The Uganda CITIESair Network is extending continuous, real-time monitoring of fine particle pollution (PM2.5) to all ten of Uganda's gazetted cities — Arua, Fort Portal, Gulu, Hoima, Jinja, Lira, Masaka, Mbale, Mbarara, and Soroti — as well as selected sites in the capital city, Kampala, building the country's first urban monitoring network with national coverage.<br/><br/>The network is in its first phase. Readings currently shown here come from our monitor at the Uganda Media Centre in Kampala, where they are also displayed on a public screen. Stations in the ten cities are being installed and will appear on this dashboard as they come online. For each station you can see the current reading and air quality index (AQI) category, historical trends, and whether the station is reporting.<br/><br/>All data are released openly, so that residents can see the air they breathe and city and national officials have the evidence they need to put Uganda's new air quality standards into practice. The network is a collaboration between academic researchers, the <a href="https://www.nema.go.ug/">National Environment Management Authority (NEMA)</a>, and the <a href="https://mediacentre.go.ug/">Uganda Media Centre</a>, supported by the <a href="https://aqfund.epic.uchicago.edu/">EPIC Air Quality Fund</a>.`;

const ProjectDescription = () => {
    const theme = useTheme();
    const { data: schoolMetadata } = useSchoolMetadata();

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
                parse(schoolMetadata.school_id === "uganda" ? ugandaDescription : schoolMetadata.description || '', {
                    replace: replacePlainHTMLWithMuiComponents,
                })
            }
        </Typography>
    )
    else {
        return (
            <>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} variant='text' />
                ))}
            </>
        )
    }
}

export default ProjectDescription;
