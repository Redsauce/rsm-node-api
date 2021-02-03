const encode64 = require("./encode64");
const expect = require("chai").expect;

describe("encode64", () => {
  it ("succesfully converts strings to Base64", () => {
    expect(encode64("Potatoes!")).to.equal("UG90YXRvZXMh");
  });
});
