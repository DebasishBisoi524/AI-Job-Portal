import DataUriParser from "datauri/parser.js";
const getDataUri = (file) => {
  const parser = new DataUriParser();
  return parser.format(file.mimetype, file.buffer);
};
export default getDataUri;
