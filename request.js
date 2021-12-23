const {isNode} = require("browser-or-node");

if (isNode) {
  f = require("node-fetch");
  module.exports.fetch = async function(...args) {
    try {
      const result = await f(...args);
      return result;
    } catch (e) {
      if (e instanceof f.FetchError) {
        throw new Error(e.message.split("reason: ")[1]);
      } else {
        throw e;
      }
    }
  }
} else {
  module.exports.fetch = fetch;
}

