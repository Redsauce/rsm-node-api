const _ = require("lodash");

const RSM_Fetch = require("./fetch").fetch;
const RSM_ParseResponse = require("./parse_response");

const RSM_DELETEITEM_PATH = "/AppController/commands_RSM/api/api_deleteItem.php";

function RSM_DeleteItem(host, path, request) {
  return new Promise(function (resolve, reject) {
    RSM_Fetch(host, path, request).then(function (response) {
      const result = RSM_ParseResponse({
        "result": "status"
      },response)[0];
      if (result.status === "OK") {
        resolve(result.status);
      } else {
        reject(result.status);
      }
    }, function (error) {
      reject(error);
    });
  });
}

function RSM_DeleteItemBuilder(api_token, host, itemType) {
  return {
    request: {
      RStoken: api_token,
      itemTypeID: itemType,
    },
    host,
    path: RSM_DELETEITEM_PATH,
    delete: function (id) {
      let new_request = _.clone(this.request);
      new_request.itemID = id;
      return RSM_DeleteItem(this.host, this.path, new_request);
    }
  }
}

module.exports = RSM_DeleteItemBuilder;
