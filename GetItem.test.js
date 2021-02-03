const expect = require("chai").expect;
const nock = require("nock");

const encode64 = require("./encode64");
const fakersm = require("./fake").response;
const matchForm = require("./testMatchForm");
const {checkIfNockIsUsed} = require('./support');

const getItem = require("./GetItem");

const RSM_GETITEM_PATH = "/AppController/commands_RSM/api/api_getItem.php";
const RSM_HOST = "https://rsm1.redsauce.net"


afterEach(() => {
  checkIfNockIsUsed(nock);
});

describe("RSM GetItem", () => {
  it("fetches correctly", async () => {
    const scope = nock(RSM_HOST)
      .post(RSM_GETITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          itemTypeID: "54",
          itemID: "3",
        })
      })
      .reply(200, fakersm([{"1337": "Nice", "42": "wat"}]));
    const response = await getItem("fakeapi", RSM_HOST, "54").fetch(3);

    expect(scope.isDone()).to.be.true;
    expect(response).to.deep.equal([{"1337": "Nice", "42": "wat"}]);
  });
});

