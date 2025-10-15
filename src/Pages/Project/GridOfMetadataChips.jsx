import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
// import { MetadataContext } from "../../ContextProviders/MetadataContext";
import { Grid } from "@mui/material";

import SchoolSelector from "../../Components/SchoolSelector";
import CustomChip from "../../Components/CustomChip";

import PersonIcon from '@mui/icons-material/Person';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import CommentIcon from '@mui/icons-material/Comment';

// import * as Tracking from '../../Utils/Tracking';
// import { scrollToSection } from "../../Components/Header/MenuItemAsNavLink";

// import sectionData from '../../section_data.json';
// import { HYVOR_PAGE_NAME, NYUAD } from "../../Utils/GlobalVariables";


// Temporarily not using HyvorTalk comment anymore
// const GridOfMetadataChips = ({ displayCommentSection }) => {


const GridOfMetadataChips = () => {
    const { schoolMetadata } = useContext(DashboardContext);

    if (!schoolMetadata) return;

    // Temporarily not using HyvorTalk comment anymore
    // const { commentCounts, fetchCommentCounts, setCommentCounts } = useContext(MetadataContext);
    // Fetch comment count for NYUAD
    // useEffect(() => {
    //     if (!schoolMetadata) return;

    //     const isNYUAD = schoolMetadata.school_id === NYUAD;
    //     if (isNYUAD && !commentCounts) {
    //         fetchCommentCounts().then((data) => {
    //             setCommentCounts(data);
    //         });
    //     }
    // }, [schoolMetadata])

    return (
        <Grid container item spacing={1} justifyContent="center">
            <Grid item>
                <SchoolSelector />
            </Grid>

            <Grid item>
                <CustomChip
                    icon={<PersonIcon />}
                    label={`${schoolMetadata.contactPerson} <${schoolMetadata.contactEmail}>`}
                    tooltipTitle="Main Contact"
                    component="a"
                    href={`mailto:${schoolMetadata?.contactEmail}`}
                    clickable
                />
            </Grid>

            {/* Temporarily not using HyvorTalk comment anymore
            {(displayCommentSection === true && commentCounts !== null) ?
                (
                    <Grid item>
                        <CustomChip
                            icon={<CommentIcon />}
                            label={`${commentCounts[HYVOR_PAGE_NAME]} Comment${commentCounts[HYVOR_PAGE_NAME] > 1 ? "s" : ""}`}
                            tooltipTitle="Number of Comments"
                            onClick={() => {
                                scrollToSection(sectionData.commentSection.id);
                                Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                                    {
                                        destination_id: sectionData.commentSection.id,
                                        destination_label: sectionData.commentSection.toString(),
                                        origin_id: 'chip'
                                    })
                            }}
                        />
                    </Grid>
                ) : null} */}
        </Grid>
    )
}

export default GridOfMetadataChips;