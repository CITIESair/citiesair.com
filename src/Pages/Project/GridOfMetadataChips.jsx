import { useContext, useEffect } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { MetadataContext } from "../../ContextProviders/MetadataContext";
import { Grid } from "@mui/material";

import SchoolSelector from "../../Components/SchoolSelector";
import CustomChip from "../../Components/CustomChip";

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
// import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';

import * as Tracking from '../../Utils/Tracking';
import { scrollToSection } from "../../Components/Header/MenuItemAsNavLink";

import jsonData from '../../section_data.json';
import { HYVOR_PAGE_NAME, NYUAD } from "../../Utils/GlobalVariables";


const GridOfMetadataChips = ({ displayCommentSection }) => {
    const { schoolMetadata } = useContext(DashboardContext);
    const { commentCounts, fetchCommentCounts, setCommentCounts } = useContext(MetadataContext);

    // Fetch comment count for NYUAD

    useEffect(() => {
        if (!schoolMetadata) return;

        const isNYUAD = schoolMetadata.school_id === NYUAD;
        if (isNYUAD && !commentCounts) {
            fetchCommentCounts().then((data) => {
                setCommentCounts(data);
            });
        }
    }, [schoolMetadata])

    return (
        <Grid container item spacing={1} justifyContent="center">
            <Grid item>
                <SchoolSelector />
            </Grid>

            <Grid item>
                <CustomChip
                    icon={<PersonIcon />}
                    label={schoolMetadata?.contactPerson}
                    tooltipTitle="Contact Person"
                />
            </Grid>

            <Grid item>
                <CustomChip
                    icon={<EmailIcon />}
                    label={schoolMetadata?.contactEmail}
                    tooltipTitle="Contact Email"
                    component="a"
                    href={`mailto:${schoolMetadata?.contactEmail}`}
                    clickable
                />
            </Grid>

            {/* <Grid item>
                <CustomChip
                    icon={<BarChartIcon />}
                    label={`${Object.keys(allChartsData).length || "..."} Chart${Object.keys(allChartsData).length !== 1 ? 's' : ''}`}
                    tooltipTitle="Number of Charts"
                    onClick={() => {
                        scrollToSection(jsonData.charts.id);
                        Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                            {
                                destination_id: jsonData.charts.id,
                                destination_label: jsonData.chartData?.toString(),
                                origin_id: 'chip'
                            });
                    }}
                />
            </Grid> */}

            {(displayCommentSection === true && commentCounts !== null) ?
                (
                    <Grid item>
                        <CustomChip
                            icon={<CommentIcon />}
                            label={`${commentCounts[HYVOR_PAGE_NAME]} Comment${commentCounts[HYVOR_PAGE_NAME] > 1 ? "s" : ""}`}
                            tooltipTitle="Number of Comments"
                            onClick={() => {
                                scrollToSection(jsonData.commentSection.id);
                                Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                                    {
                                        destination_id: jsonData.commentSection.id,
                                        destination_label: jsonData.commentSection.toString(),
                                        origin_id: 'chip'
                                    })
                            }}
                        />
                    </Grid>
                ) : null}
        </Grid>
    )
}

export default GridOfMetadataChips;