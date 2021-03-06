const request = require("./request");
const FormData = require("form-data");
const {DOMParser} = require("xmldom");
const {isNode} = require("browser-or-node");

const RSM_DEFAULT_HOST = "https://rsm1.redsauce.net";

async function RSM_Fetch(host = RSM_DEFAULT_HOST, path, data) {
  let form_data = new FormData();
  Object.entries(data).forEach(([entry, value]) => {
    if ((typeof value) !== "undefined") {
      form_data.append(entry, value);
    }
  });
  const response = await request.fetch(host + path, {
    method: "POST",
    body: form_data,
    headers: buildHeaders(form_data),
  });
  const textdata = await response.text();
  const XML = textdata.replace(RegExp("<br>","g"), "\n");
  const dom = new DOMParser().parseFromString(XML);
  return dom;
}

function buildHeaders(form_data) {
  if (isNode) {
    return form_data.getHeaders();
  } else {
    return {"content-type": "multipart/form-data"};
  }
}

module.exports = {fetch: RSM_Fetch};
