import { Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, styled, TableFooter } from '@mui/material';
import { domToReact, DOMNode, Element } from 'html-react-parser';
import { Fragment, ReactNode } from 'react';

export const roundNumberTo = (value: number, decimals: number = 6): number =>
  Number(value.toFixed(decimals));

// Function to check if an array has valid data
export const isValidArray = (array: unknown): boolean =>
  Array.isArray(array) && array.length > 0 && !array.every((item) => item == null);

// Function to replace characters like "-" with " " from a string and capitalize it
export const capitalizePhrase = (str: string | null | undefined): string => {
  if (!str) return "";

  const words = str.split(/[\s-]+/);
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const capitalizedString = capitalizedWords.join(' ');
  return capitalizedString;
};

const htmlOrderedListTypeToMUIListStyle: Record<string | number, string> = {
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

export const replacePlainHTMLWithMuiComponents = (node: DOMNode): JSX.Element | undefined => {
  if (node.type !== 'tag') return undefined;

  const element = node as Element;

  const options = {
    replace: replacePlainHTMLWithMuiComponents
  };

  const parseChildren = (children: DOMNode[]): ReactNode[] => {
    return children.map((child, index) => (
      <Fragment key={`child-${index}`}>
        {domToReact([child], options)}
      </Fragment>
    ));
  };

  switch (element.name) {
    case 'a': {
      return (
        <Link
          href={element.attribs.href}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ wordBreak: 'break-all' }}
        >
          {parseChildren(element.children as DOMNode[])}
        </Link>
      );
    }

    case 'ul': {
      return (
        <List dense sx={{ listStyleType: htmlOrderedListTypeToMUIListStyle.disc, paddingLeft: 4, paddingTop: '6px' }}>
          {(element.children as Element[]).map((child, index) => (
            <StyleListItem key={`ul-item-${index}`}>
              <ListItemText primary={parseChildren(child.children as DOMNode[])} />
            </StyleListItem>
          ))}
        </List>
      );
    }

    case 'ol': {
      return (
        <List dense sx={{ listStyleType: htmlOrderedListTypeToMUIListStyle[element.attribs.type], paddingLeft: 4, paddingTop: '6px' }}>
          {(element.children as Element[]).map((child, index) => (
            <StyleListItem key={`ol-item-${index}`}>
              <ListItemText primary={parseChildren(child.children as DOMNode[])} />
            </StyleListItem>
          ))}
        </List>
      );
    }

    case 'table': {
      const children = element.children as Element[];
      const thead = children.find((child) => child.name === 'thead');
      const tbody = children.find((child) => child.name === 'tbody');
      const tfoot = children.find((child) => child.name === 'tfoot');

      const headerCells = thead
        ? ((thead.children as Element[]).find((child) => child.name === 'tr')?.children as Element[] || []).filter((child) => child.name === 'th')
        : [];
      const rows = tbody ? (tbody.children as Element[]).filter((child) => child.name === 'tr') : [];
      const footerCells = tfoot
        ? ((tfoot.children as Element[]).find((child) => child.name === 'tr')?.children as Element[] || []).filter((child) => child.name === 'td')
        : [];

      return (
        <Table size="small" sx={{ mt: 1, width: 'fit-content' }}>
          <TableHead>
            <TableRow>
              {headerCells.map((child, index) => (
                <TableCell key={`headerCell-${index}`}>{domToReact(child.children as DOMNode[])}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {(row.children as Element[]).filter((child) => child.name === 'td').map((cell, cellIndex) => (
                  <TableCell key={`cell-${rowIndex}-${cellIndex}`}>{domToReact(cell.children as DOMNode[])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {footerCells.map((child, index) => (
              <TableCell key={`footerCell-${index}`}>{domToReact(child.children as DOMNode[])}</TableCell>
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


export const validateEmail = (email: string): RegExpMatchArray | null => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

interface TranslatableField {
  en: string;
  [lang: string]: string;
}

export const getTranslation = (
  field: string | TranslatableField | null | undefined,
  lang: string = "en",
  replacements: Record<string, ReactNode> = {}
): ReactNode | null => {
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
