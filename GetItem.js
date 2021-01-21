const _ = require("lodash");

const RSM_Fetch = require("./fetch");
const RSM_ParseResponse = require("./parse_response");

const RSM_GETITEM_PATH = "/AppController/commands_RSM/api/api_getItem.php";

function RSM_GetItem(path, request) {
  return new Promise(function (resolve, reject) {
    RSM_Fetch(path, request).then(function (response) {
      resolve(RSM_ParseResponse({}, response));
    }, function (error) {
      reject(error);
    });
  });
}

function RSM_GetItemBuilder(api_token, itemType) {
  return {
    request: {
      RStoken: api_token,
      itemTypeID: itemType,
      itemID: null,
    },
    path: RSM_GETITEM_PATH,
    fetch: function (id) {
      let new_request = _.clone(this.request);
      new_request.itemID = id;
      return RSM_GetItem(this.path, new_request);
    }
  }
}

module.exports = RSM_GetItemBuilder;
