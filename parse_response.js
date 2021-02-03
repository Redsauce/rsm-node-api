function buildObject(key_values) {
  let result = {}

  for (let i in key_values) {
    result[key_values[i][0]] = key_values[i][1];
  }
  return result
}

function RSM_ParseResponse(property_names, response) {
  return Array.from(response.getElementsByTagName("row")).map(function (row) {
    const properties = Array.from(row.getElementsByTagName("column")).map(function (column) {
      if (column.getAttribute("name") === "ID") {
        return ["ID", column.childNodes[0].data]
      } else {
        if (column.getAttribute("name") in property_names) {
          return [property_names[column.getAttribute("name")], column.childNodes[0].data]
        } else if (Object.keys(property_names).length === 0) {
          return [column.getAttribute("name"), column.childNodes[0].data]
        } else {
          return null
        }
      }
    }).filter(x => x !== null);
    return buildObject(properties);
  });
}

module.exports = RSM_ParseResponse;
