import { Box, GlobalStyles, useTheme } from '@mui/material/';
import { styled } from '@mui/material/styles';

const GoogleChartStyleWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gradientBackgroundId' && prop !== 'isPortrait',
})(({ theme, isPortrait, gradientBackgroundId }) => ({
  '& [id*="google-visualization-errors-all"]': {
    display: 'none !important'
  },
  // CSS for optional gradient background 
  '& svg>g:nth-of-type(2)>rect:first-of-type': {
    fill: `url(#${gradientBackgroundId})`,
    fillOpacity: 1,
    filter: 'contrast(0.4) brightness(1.4)'
  },
  // CSS for HTML tooltip
  '& .google-visualization-tooltip, .nivo-tooltip': {
    width: 'unset !important',
    maxWidth: '350px',
    height: 'unset',
    padding: '1em',
    boxShadow: '0px 2px 2px 0px rgba(204, 204, 204, 0.6)',
    mozBoxShadow: '0px 2px 2px 0px rgba(204, 204, 204, 0.6)',
    webkitBoxShadow: '0px 2px 2px 0px rgba(204, 204, 204, 0.6)',
    border: 'solid 1px',
    borderColor: theme.palette.text.secondaryRGB,
    fontSize: `${isPortrait ? 9 : 12}px`,
    color: theme.palette.chart.tooltip.text,
    background: theme.palette.chart.tooltip.background,
    borderRadius: theme.shape.borderRadius,
    '& ul': {
      margin: '0 !important',
      '& li': {
        margin: '0 !important',
        padding: '0 !important',
        '& span': {
          fontSize: `${isPortrait ? 9 : 12}px !important`,
          color: `${theme.palette.chart.tooltip.text} !important`,
        }
      }
    }
  },

  // -------- chartControl's additional stylings
  '& .goog-menuitem-highlight, .goog-menuitem-hover': {
    backgroundColor: `${theme.palette.primary} !important`
  },
  // CategoryFilter
  '& .google-visualization-controls-categoryfilter': {
    display: "flex",
    flexDirection: "column",
    fontSize: '0.75rem',
    gap: theme.spacing(1),
    [theme.breakpoints.down("lg")]: {
      marginTop: theme.spacing(0.5),
    },
    '& .goog-menu-button-caption': {
      marginRight: theme.spacing(0.75)
    },
    '& .goog-menu-button': {
      marginTop: 0,
      width: "100%",
      background: "transparent !important"
    },
    '& .goog-menu-button-hover': {
      '& .goog-menu-button-outer-box': {
        borderColor: "transparent !important"
      },
      '& .goog-menu-button-inner-box': {
        borderColor: `${theme.palette.text.primary} !important`
      }
    },
    '& .google-visualization-controls-label': {
      [theme.breakpoints.down("lg")]: {
        display: "none"
      },
      fontSize: "1rem !important",
      fontWeight: "400 !important",
      textTransform: "uppercase !important",
      color: theme.palette.text.secondary,
      verticalAlign: 'middle'
    },
    '& .goog-menu-button-outer-box': {
      border: '0',
      width: "100%",

      '& .goog-menu-button-inner-box': {
        display: "flex",
        height: "2rem",
        justifyContent: "space-between",
        paddingTop: theme.spacing(0.8125),
        paddingBottom: theme.spacing(0.8125),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        borderColor: theme.palette.divider,
        borderWidth: '1px',
        borderRadius: theme.shape.borderRadius,
        width: "100%",

        '& .goog-menu-button-caption': {
          color: theme.palette.text.secondary
        }
      }
    },
    '& .google-visualization-controls-categoryfilter-selected': {
      '& li': {
        color: theme.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(1),
        background: theme.palette.background.paper,
        '& .goog-link-button': {
          verticalAlign: "top",
          fontSize: "0.75rem",
          color: theme.palette.text.secondary
        }
      }
    }
  },

  // DateRangeFilter
  '& .google-visualization-controls-rangefilter': {
    width: '100%',
    fontSize: '0.75rem',
    '& .goog-inline-block': {
      width: '100%',
    },
    '& .google-visualization-controls-slider-horizontal': {
      width: '90%',
      margin: '0 5%',
    },
    '& .google-visualization-controls-rangefilter-thumblabel:nth-of-type(1)': {
      position: 'absolute',
      top: '1.5em',
      left: '5%'
    },
    '& .google-visualization-controls-rangefilter-thumblabel:nth-of-type(2)': {
      position: 'absolute',
      top: '1.5em',
      right: '5%'
    },
    '& .google-visualization-controls-slider-handle': {
      background: theme.palette.primary.main
    },
    '& .google-visualization-controls-rangefilter-thumblabel': {
      color: theme.palette.text.secondary,
      padding: 0,
      fontWeight: 500
    },
    '& .google-visualization-controls-slider-thumb': {
      background: theme.palette.primary.main,
      border: 'unset',
      borderRadius: theme.shape.borderRadius
    }
  },

  // These are the paths showing on top of the line chart
  // and the stroke around the bar/column chart
  // when the user hovers on the legend to make the serie stand out
  // by Google Chart's default doesn't change color based on light/dark theme, but we modify here:
  '& path[stroke-opacity="0.3"], path[stroke-opacity="0.1"], path[stroke-opacity="0.05"], rect[stroke-opacity]': {
    stroke: theme.palette.text.primary,
    strokeWidth: 3
  },

  // Cursor of series in legends
  '& [column-id]:not(:empty)': {
    cursor: 'pointer',
    ':hover': {
      fontWeight: 600
    }
  }
}));

export const GoogleChartGlobalStyles = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '.goog-menu-vertical': {
          borderColor: "transparent !important",
          backgroundColor: `${theme.palette.customAlternateBackground} !important`,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[4],
          color: theme.palette.text.primary,
          zIndex: 1500,
          '& .goog-menuitem': {
            paddingTop: theme.spacing(0.75),
            paddingBottom: theme.spacing(0.75),
            '& .goog-menuitem-content': {
              color: theme.palette.text.primary,
              fontFamily: "'IBM Plex Sans', sans-serif !important",
            }
          },
        },
        '.goog-menuitem-highlight, .goog-menuitem-hover': {
          backgroundColor: `${theme.palette.action.hover} !important`,
          border: "transparent !important"
        },
      }}
    />
  );
};

export default GoogleChartStyleWrapper;
