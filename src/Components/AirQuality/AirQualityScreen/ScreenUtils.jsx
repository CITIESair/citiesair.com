export const getDomainName = (url) => {
  return new URL(url).hostname;
}

export const getUrlAfterScreen = (url) => {
  const screenString = 'screen';
  const urlComponents = url.split(screenString);
  return `${screenString}${urlComponents.pop()}`;
}

export const removeLastDirectoryFromURL = (url) => {
  const urlComponents = url.split('/');
  // Remove the last component (directory)
  urlComponents.pop();
  // Reconstruct the URL with the last directory removed
  return urlComponents.join('/') + '/';
}

export const areDOMOverlapped = (rect1, rect2) => {
  if (!(rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
    if (rect1.top < rect2.top) return -1;
    else return 1;
  }
  else return 0;
}
