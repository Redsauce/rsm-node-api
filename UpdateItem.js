const _ = require("lodash");

const encode64 = require("./encode64");
const RSM_Fetch = require("./fetch").fetch;
const RSM_ParseResponse = require("./parse_response");

const RSM_UPDATEITEM_PATH = "/AppController/commands_RSM/api/api_updateItem.php";

function RSM_UpdateItem(host, path, request) {
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

function buildProps(props) {
  return Object.entries(props)
    .map(([prop, value]) => `${prop}:${encode64(value)}`).join(";")
}

function RSM_UpdateItemBuilder(api_token, host, itemType) {
  return {
    request: {
      RStoken: api_token,
      itemTypeID: itemType,
    },
    host,
    path: RSM_UPDATEITEM_PATH,
    update: function (id, newProps) {
      let new_request = _.clone(this.request);
      new_request.RSitemID = id;
      new_request.RSdata = buildProps(newProps);
      return RSM_UpdateItem(this.host, this.path, new_request);
    }
  }
}

module.exports = RSM_UpdateItemBuilder;
