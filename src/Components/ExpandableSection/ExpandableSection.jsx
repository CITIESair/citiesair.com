// disable eslint for this file
/* eslint-disable */
import { useState } from 'react';
import { styled } from '@mui/material/styles';

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Box, Typography, Tooltip } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as Tracking from '../../Utils/Tracking';

const StyledAccordion = styled(MuiAccordion)(({ theme, expanded }) => ({
  color: theme.palette.text.secondary,
  backgroundImage: 'none',
  backgroundColor: expanded ? theme.palette.background.default : 'transparent',
  boxShadow: expanded ? theme.shadows : 'none',
  transition: 'none',
}));

const StyledAccordionSummary = styled(MuiAccordionSummary)(({ theme, expanded }) => ({
  marginTop: expanded ? theme.spacing(1) : 0,
  flexDirection: 'row-reverse',
  paddingLeft: expanded ? theme.spacing(1) : 0,
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
    textDecoration: 'underline',
    transition: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const TooltipText = {
  expand: "Click to expand section",
  collapse: "Click to collapse section"
}

const ExpandableSection = (props) => {
  const { title, content, icon, disabled } = props;
  const [expanded, setExpanded] = useState(undefined);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : undefined);
    Tracking.sendEventAnalytics(
      isExpanded ? Tracking.Events.expandSection : Tracking.Events.collapseSection,
      {
        section: title
      }
    );
  };

  return (
    <Box sx={{
      '& .MuiAccordion-root.Mui-disabled': {
        backgroundColor: "transparent"
      }
    }}>
      <StyledAccordion
        expanded={expanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
        disabled={disabled}
      >
        <StyledAccordionSummary expanded={expanded} expandIcon={<ArrowDropDownIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Tooltip title={expanded ? TooltipText.collapse : TooltipText.expand} enterDelay={0} leaveDelay={200}>
            <Typography component="a" variant="body1">
              {title}
              <Box component="span" sx={{ ml: 0.25 }}>
                {icon}
              </Box>
            </Typography>
          </Tooltip>
        </StyledAccordionSummary>
        <MuiAccordionDetails sx={{ pt: 0 }}>
          {content}
        </MuiAccordionDetails>
      </StyledAccordion>
    </Box>
  );
}

export default ExpandableSection;