const expect = require("chai").expect;
const sinon = require("sinon");
const {DOMParser} = require("xmldom");

const fetch = require("./fetch");
const encode64 = require("./encode64");
const fakersm = require("./fake").response;

const getItem = require("./GetItem");

const RSM_GETITEM_PATH = "/AppController/commands_RSM/api/api_getItem.php";
const RSM_HOST = "https://localhost"


describe("RSM GetItem", () => {

  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("fetches correctly", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{"1337": "Nice", "42": "wat"}])));

    const response = await getItem("fakeapi", RSM_HOST, "54").fetch("3");

    expect(response).to.deep.equal([{"1337": "Nice", "42": "wat"}]);
    console.log(stub.lastCall);
    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_GETITEM_PATH, {
      RStoken: "fakeapi",
      itemTypeID: "54",
      itemID: "3",
    })).to.be.true;
  });
});

