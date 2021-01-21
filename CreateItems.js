const _ = require("lodash");

const encode64 = require("./encode64");
const RSM_Fetch = require("./fetch");
const RSM_ParseResponse = require("./parse_response");

const RSM_CREATEITEMS_PATH = "/AppController/commands_RSM/api/api_createItem.php";

function RSM_CreateItems(host, path, request) {
  return new Promise(function (resolve, reject) {
    RSM_Fetch(host, path, request).then(function (response) {
      const result = RSM_ParseResponse({
        "itemID": "itemID",
        "result": "status"
      },response)[0];
      if (result.status === "OK" && result.itemID.length > 0) {
        resolve(result.itemID.split(","));
      } else {
        reject(result.status);
      }
    }, function (error) {
      reject(error);
    });
  });
}

function buildRequest(req) {
  return {
    RStoken: req.RStoken,
    RSdata: req.items.map((item) => {
      return Object.entries(item)
        .map(([propertyID, value]) => {
          return `${propertyID}:${encode64(value)}`
        }).join(";");
    }).join(","),
  }
}

function RSM_CreateItemsBuilder(api_token, host) {
  return {
    request: {
      RStoken: api_token,
      items: [],
    },
    host,
    path: RSM_CREATEITEMS_PATH,
    item: function (itemProperties) {
      let new_request = _.cloneDeep(this);
      new_request.request.items.push(itemProperties);
      return new_request;
    },
    send: function () {
      return RSM_CreateItems(this.host, this.path, buildRequest(this.request));
    }
  }
}

module.exports = RSM_CreateItemsBuilder;
