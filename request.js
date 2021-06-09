const {isNode} = require("browser-or-node");

if (isNode) {
  module.exports.fetch = require("node-fetch");
} else {
  module.exports.fetch = fetch;
}

