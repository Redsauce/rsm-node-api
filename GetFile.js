const axios = require("axios");

module.exports = (token, host = "https://rsm1.redsauce.net", id, propertyID) =>
  axios.get(`${host}/AppController/commands_RSM/api/api_getFile.php?RStoken=${token}&itemID=${id}&propertyID=${propertyID}`,{
  responseType: 'stream',
});
