function build_rsm_column([name, value]) {
  return `<column name="${name}"><![CDATA[${value}]]></column>`
}

function build_rsm_row(element) {
  return `<row>${Object.entries(element).map(build_rsm_column)}</row>`
}

function build_fake_rsm_response(json) {
  if ((typeof json) === "string") {
    return json
  }
  return `<?xml version="1.0" encoding="UTF-8" ?><RSRecordset><rows>${json.map(build_rsm_row)}</rows></RSRecordset>`
}

function fake_rsm(api, statusCode, data, method){
  const nock = require("nock"); // only required if used
  if ((typeof method) === "undefined") {
    method = "POST";
  }
  nock("https://rsm1.redsauce.net")
    .intercept(`/AppController/commands_RSM/api/api_${api}.php`, method)
    .query(true)
    .reply(statusCode, build_fake_rsm_response(data));
}

module.exports = {
  http_request: fake_rsm,
  response: build_fake_rsm_response,
}
