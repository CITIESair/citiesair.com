import { Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, styled, TableFooter } from '@mui/material';
import { domToReact } from 'html-react-parser';
import { Fragment } from 'react';

// Function to check if an array has valid data
// eslint-disable-next-line max-len
export const isValidArray = (array) => Array.isArray(array) && array.length > 0 && !array.every((item) => item == null);

// Function to replace characters like "-" with " " from a string and capitalize it
export const capitalizePhrase = (str) => {
  if (!str) return "";

  const words = str.split(/[\s-]+/);
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const capitalizedString = capitalizedWords.join(' ');
  return capitalizedString;
};

const htmlOrderedListTypeToMUIListStyle = {
  1: 'decimal',
  '01': 'decimal-leading-zero',
  a: 'lower-alpha',
  A: 'upper-alpha',
  i: 'lower-roman',
  I: 'upper-roman',
  square: 'square',
  circle: 'circle',
  disc: 'disc'
};

const StyleListItem = styled(ListItem)(() => ({
  '::marker': {
    fontSize: '0.9rem'
  },
  display: 'list-item',
  paddingBottom: '0.125rem',
  paddingTop: 0,
  paddingLeft: '0.25rem'
}));

export const replacePlainHTMLWithMuiComponents = (node) => {
  if (node.type !== 'tag') return undefined;

  const options = {
    replace: replacePlainHTMLWithMuiComponents
  };

  const parseChildren = (children) => {
    return children.map((child, index) => (
      <Fragment key={`child-${index}`}>
        {domToReact([child], options)}
      </Fragment>
    ));
  };

  switch (node.name) {
    case 'a': {
      return (
        <Link
          href={node.attribs.href}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ wordBreak: 'break-all' }}
        >
          {parseChildren(node.children)}
        </Link>
      );
    }

    case 'ul': {
      return (
        <List dense sx={{ listStyleType: htmlOrderedListTypeToMUIListStyle.disc, paddingLeft: 4, paddingTop: '6px' }}>
          {node.children.map((child, index) => (
            <StyleListItem key={`ul-item-${index}`}>
              <ListItemText primary={parseChildren(child.children)} />
            </StyleListItem>
          ))}
        </List>
      );
    }

    case 'ol': {
      return (
        <List dense sx={{ listStyleType: htmlOrderedListTypeToMUIListStyle[node.attribs.type], paddingLeft: 4, paddingTop: '6px' }}>
          {node.children.map((child, index) => (
            <StyleListItem key={`ol-item-${index}`}>
              <ListItemText primary={parseChildren(child.children)} />
            </StyleListItem>
          ))}
        </List>
      );
    }

    case 'table': {
      const thead = node.children.find((child) => child.name === 'thead');
      const tbody = node.children.find((child) => child.name === 'tbody');
      const tfoot = node.children.find((child) => child.name === 'tfoot');

      const headerCells = thead ? thead.children.find((child) => child.name === 'tr').children.filter((child) => child.name === 'th') : [];
      const rows = tbody ? tbody.children.filter((child) => child.name === 'tr') : [];
      const footerCells = tfoot ? tfoot.children.find((child) => child.name === 'tr').children.filter((child) => child.name === 'td') : [];

      return (
        <Table size="small" sx={{ mt: 1, width: 'fit-content' }}>
          <TableHead>
            <TableRow>
              {headerCells.map((child, index) => (
                <TableCell key={`headerCell-${index}`}>{domToReact(child.children)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {row.children.filter((child) => child.name === 'td').map((cell, cellIndex) => (
                  <TableCell key={`cell-${rowIndex}-${cellIndex}`}>{domToReact(cell.children)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {footerCells.map((child, index) => (
              <TableCell key={`footerCell-${index}`}>{domToReact(child.children)}</TableCell>
            ))}
          </TableFooter>
        </Table>
      );
    }

    default: {
      return undefined;
    }
  }
};


export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getTranslation = (field, lang = "en", replacements = {}) => {
  if (field === null || field === undefined) return null;

  const template =
    typeof field === "string" ? field : field[lang] || field.en;

  // If no placeholders, just return string
  if (!template.includes("{{")) {
    return template;
  }

  // Otherwise, split and replace placeholders
  const parts = template.split(/(\{\{.*?\}\})/g);

  return parts.map((part, i) => {
    const match = part.match(/\{\{(.*?)\}\}/);
    if (match) {
      const key = match[1].trim();
      if (replacements[key] !== undefined) {
        return <Fragment key={i}>{replacements[key]}</Fragment>;
      }
      return ""; // fallback: drop unknown placeholder
    }
    return part; // plain text
  });
};

export const isWithinDisplayHours = () => {
  const params = new URLSearchParams(window.location.search);
  const displayHours = params.get("displayHours");
  if (!displayHours) return true; // Show screen if no parameter

  const [start, end] = displayHours.split("-").map(time => parseInt(time.replace(":", ""), 10));
  const now = parseInt(new Date().toTimeString().slice(0, 5).replace(":", ""), 10);

  if (start <= end) {
    // Regular range (same day, e.g., 06:00-20:00)
    return start <= now && now < end;
  } else {
    // Overnight range (e.g., 16:00-01:00)
    return now >= start || now < end;
  }
}