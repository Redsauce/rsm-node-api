const request = require("./request");

module.exports = async (token, host = "https://rsm1.redsauce.net", id) => {
  const response = await request.fetch(`${host}/AppController/commands_RSM/api/api_getPicture.php?RStoken=${token}&itemID=${id}&propertyID=1509`);
  return (await response.blob()).stream();
}
