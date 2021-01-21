const axios = require("axios");

module.exports = (token, host = "https://rsm1.redsauce.net", id) =>
  axios.get(`${host}/AppController/commands_RSM/api/api_getPicture.php?RStoken=${token}&itemID=${id}&propertyID=1509`,{
  responseType: 'stream',
});
