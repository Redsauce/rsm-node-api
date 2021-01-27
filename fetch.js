const axios = require("axios");
const FormData = require("form-data");
const {DOMParser} = require("xmldom");

const RSM_DEFAULT_HOST = "https://rsm1.redsauce.net";

async function RSM_Fetch(host = RSM_DEFAULT_HOST, path, data) {
  let form_data = new FormData();
  Object.entries(data).forEach(([entry, value]) => {
    if ((typeof value) !== "undefined") {
      form_data.append(entry, value);
    }
  });
  const config = {
    method: "post",
    url: host + path,
    data: form_data,
    headers: form_data.getHeaders(),
  }
  const response = await axios(config);
  const XML = response.data.replace(RegExp("<br>","g"), "\n");
  const dom = new DOMParser().parseFromString(XML);
  return dom;
}

module.exports = RSM_Fetch;
