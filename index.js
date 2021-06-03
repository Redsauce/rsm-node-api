const CreateItems = require("./CreateItems");
const DeleteItem = require("./DeleteItem");
const GetFile = require("./GetFile");
const GetItems = require("./GetItems");
const GetItem = require("./GetItem");
const GetPicture = require("./GetPicture");
const UpdateItem = require("./UpdateItem");

function RSM(api_token, host) {
  this.token = api_token;
  this.host = host;
  this.createItems = () => CreateItems(this.token, this.host);
  this.deleteItem = (type) => DeleteItem(this.token, this.host, type);
  this.getFile = (id, propertyID) => GetFile(this.token, this.host, id, propertyID);
  this.getItems = () => GetItems(this.token, this.host);
  this.getItem = (type) => GetItem(this.token, this.host, type);
  this.getPicture = (id) => GetPicture(this.token, this.host, id);
  this.updateItem = (type) => UpdateItem(this.token, this.host, type);
}

module.exports = {
  RSM,
  default: RSM,
}
