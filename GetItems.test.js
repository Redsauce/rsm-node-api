const expect = require("chai").expect;
const nock = require("nock");

const encode64 = require("./encode64");
const fakersm = require("./fake").response;
const matchForm = require("./testMatchForm");
const {checkIfNockIsUsed} = require('./support');

const getItems = require("./GetItems");

const RSM_GETITEMS_PATH = "/AppController/commands_RSM/api/api_getItems.php";
const RSM_HOST = "https://rsm1.redsauce.net"

afterEach(() => {
  checkIfNockIsUsed(nock);
});

describe("RSM GetItems", () => {
  it("fetches correctly", async () => {
    const scope = nock(RSM_HOST)
      .post(RSM_GETITEMS_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fake api token",
          propertyIDs: "1337,42",
          filterRules: "1337;JXBvdGF0byU=;LIKE",
          filterJoining: "AND",
        })
      })
      .reply(200, fakersm([{"1337": "Nice", "42": "wat"}]));
          

    const response = await getItems("fake api token", RSM_HOST)
      .properties({
        "Potato": 1337,
        "The Universe": 42,
      }).filters([
        {property: 1337, mode: "LIKE", value: "%potato%"},
      ])
      .fetch();

    expect(scope.isDone()).to.be.true;
    expect(response).to.deep.equal([{"Potato": "Nice", "The Universe": "wat"}]);
  });
});
