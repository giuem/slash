export const processCSS = (content, path, isJS = false) => {
  return isJS
    ? `
    const link = document.createElement('link');
    link.id = '${path}';
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', '${path}');
    document.head.appendChild(link);
  `
    : content;
};
