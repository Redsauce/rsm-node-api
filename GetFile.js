const request = require("./request");

module.exports = async (token, host = "https://rsm1.redsauce.net", id, propertyID) => {
  const response = await request.fetch(`${host}/AppController/commands_RSM/api/api_getFile.php?RStoken=${token}&itemID=${id}&propertyID=${propertyID}`);
  return (await response.blob()).stream();
}
