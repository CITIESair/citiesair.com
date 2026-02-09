import React, { ReactNode } from 'react';
import Link, { LinkProps } from '@mui/material/Link';

interface CustomLinkProps extends LinkProps {
  children: ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ children, ...props }) => {
  return (
    <Link {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  );
};

export default CustomLink;
