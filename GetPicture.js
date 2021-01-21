const axios = require("axios");

module.exports = (token, id) => axios.get(`https://rsm1.redsauce.net/AppController/commands_RSM/api/api_getPicture.php?RStoken=${token}&itemID=${id}&propertyID=1509`,{
  responseType: 'stream',
});
