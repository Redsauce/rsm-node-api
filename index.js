const CreateItems = require("./CreateItems");
const DeleteItem = require("./DeleteItem");
const GetItems = require("./GetItems");
const GetItem = require("./GetItem");
const GetPicture = require("./GetPicture");
const UpdateItem = require("./UpdateItem");

function RSM(api_token) {
  this.token = api_token;
  this.createItems = () => CreateItems(this.token);
  this.deleteItem = (type) => DeleteItem(this.token, type);
  this.getItems = () => GetItems(this.token);
  this.getItem = (type) => GetItem(this.token, type);
  this.getPicture = (id) => GetPicture(this.token, id);
  this.updateItem = (type) => UpdateItem(this.token, type);
}

module.exports = RSM;
