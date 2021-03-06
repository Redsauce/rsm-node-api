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

module.exports = {
  response: build_fake_rsm_response,
}
