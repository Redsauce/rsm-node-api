const RSM_ParseResponse  = require("./parse_response");
const expect = require("chai").expect;
const fake = require("./fake");
const {DOMParser} = require("xmldom");

describe("parse_response", () => {
  it ("succesfully parses a normal XML", () => {
    const fakeXML = fake.response([{"key": "value"}]);
    const fakeDOM = new DOMParser().parseFromString(fakeXML);
    const result = RSM_ParseResponse({"key": "my_key"}, fakeDOM);
    expect(result).to.deep.equal([{"my_key": "value"}]);
  });

  it ("correctly deals with empty values", () => {
    const fakeXML = fake.response([{"key": ""}]);
    const fakeDOM = new DOMParser().parseFromString(fakeXML);
    const result = RSM_ParseResponse({"key": "my_key"}, fakeDOM);
    expect(result).to.deep.equal([{"my_key": ""}]);
  });
});
