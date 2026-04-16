export const TypesOfScreen = {
  bothIndoors: 1,
  bothOutdoors: 2,
  indoorsVsOutdoors: 3
} as const;

export const removeLastDirectoryFromURL = (url: string): string => {
  const urlComponents = url.split('/');
  // Remove the last component (directory)
  urlComponents.pop();
  // Reconstruct the URL with the last directory removed
  return urlComponents.join('/') + '/';
}

export const areDOMOverlapped = (rect1: DOMRect, rect2: DOMRect): number => {
  if (!(rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
    if (rect1.top < rect2.top) return -1;
    else return 1;
  }
  else return 0;
}
