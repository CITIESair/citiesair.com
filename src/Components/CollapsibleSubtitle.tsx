import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import parse from 'html-react-parser';
import { useMediaQuery, useTheme } from '@mui/material';
import { replacePlainHTMLWithMuiComponents } from '../Utils/UtilFunctions';

interface CollapsibleSubtitleProps {
  text: string;
  wordLimit?: number;
  reference?: string;
}

function CollapsibleSubtitle({ text, wordLimit = 40, reference }: CollapsibleSubtitleProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const subtitleRef = useRef<HTMLDivElement>(null);

  const words = text.split(' ');

  // If not on mobile or words are within limit, just display the full text
  if (!isMobile || words.length / wordLimit <= 1.4) {
    return (
      <Box>
        <Typography>{parse(text, { replace: replacePlainHTMLWithMuiComponents })}</Typography>
        {reference && (
          <Typography variant="caption" color="text.secondary">
            {parse(reference, { replace: replacePlainHTMLWithMuiComponents })}
          </Typography>
        )}
      </Box>
    );
  }

  let displayText = words.slice(0, wordLimit).join(' ');
  const lastFullStop = displayText.lastIndexOf('.');

  if (lastFullStop !== -1) {
    displayText = displayText.slice(0, lastFullStop + 1);
  }

  // Do not collapse if the user clicks on the chart associated with the subtitle
  const isClickWithinSharedParent = (event: MouseEvent | TouchEvent): boolean => {
    let target = event.target as HTMLElement | null;
    // .MuiContainer-root - Container for both the subtitle and the chart
    const subtitleParent = subtitleRef.current?.closest('.MuiContainer-root');
    // Elements used to detect if the click is on a chart
    const chartElements = new Set(['rect', 'path', 'svg', 'circle']);

    while (target != null) {
      // Check if a chart is clicked
      if (chartElements.has(target?.tagName)) {
        // If the chart element and the subtitle element share the same container
        // it means that the click is on the chart associated with the subtitle
        // As such, we should not collapse the subtitle
        const targetParent = target.closest('.MuiContainer-root');
        return targetParent === subtitleParent;
      }
      target = target.parentNode as HTMLElement | null; // Move up the DOM tree
    }
    return false;
  };

  // Custom onClickAway handler
  const handleOnClickAway = (event: MouseEvent | TouchEvent): void => {
    if (!isClickWithinSharedParent(event)) {
      setIsExpanded(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleOnClickAway}>
      <Box ref={subtitleRef} onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? (
          <>
            <Typography>{parse(text, { replace: replacePlainHTMLWithMuiComponents })}</Typography>
            {reference && <Typography variant="caption" color="text.secondary">{parse(reference, { replace: replacePlainHTMLWithMuiComponents })}</Typography>}
          </>
        ) : (
          <>
            <Typography display="inline">
              {parse(displayText, { replace: replacePlainHTMLWithMuiComponents })}
              ...
            </Typography>
            <Typography display="inline" color="text.primary" fontWeight="500" sx={{ ml: 0.5, '& :hover': { textDecoration: 'underline' } }}>
              See more
            </Typography>
          </>
        )}
      </Box>
    </ClickAwayListener>
  );
}

export default CollapsibleSubtitle;
