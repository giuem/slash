export const processJSON = (content, isJS = false) => {
  return isJS ? `export default JSON.parse('${content}')` : content;
};
