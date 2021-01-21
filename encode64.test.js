/**
 * @jest-environment node
 */

const encode64 = require("./encode64");

describe("encode64", () => {
  it ("succesfully converts strings to Base64", () => {
    expect(encode64("Potatoes!")).toEqual("UG90YXRvZXMh");
  });
});
