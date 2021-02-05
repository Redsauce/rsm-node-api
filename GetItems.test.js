const expect = require("chai").expect;
const sinon = require("sinon");
const {DOMParser} = require("xmldom");

const fetch = require("./fetch");
const encode64 = require("./encode64");
const fakersm = require("./fake").response;

const getItems = require("./GetItems");

const RSM_GETITEMS_PATH = "/AppController/commands_RSM/api/api_getItems.php";
const RSM_HOST = "http://localhost"

describe("RSM GetItems", () => {

  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("fetches correctly", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{"1337": "Nice", "42": "wat"}])));

    const response = await getItems("fake api token", RSM_HOST)
      .properties({
        "Potato": 1337,
        "The Universe": 42,
      }).filters([
        {property: 1337, mode: "LIKE", value: "%potato%"},
      ])
      .fetch();

    expect(response).to.deep.equal([{"Potato": "Nice", "The Universe": "wat"}]);
    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_GETITEMS_PATH, {
      RStoken: "fake api token",
      propertyIDs: "1337,42",
      filterRules: "1337;JXBvdGF0byU=;LIKE",
      extFilterRules: undefined,
      filterJoining: "AND",
    })).to.be.true;
  });
});
