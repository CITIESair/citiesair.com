import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop({ children }) {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // if navigation type is pop, do not scroll to top
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [location, navigationType]);

  return children || null;
}

export default ScrollToTop;
