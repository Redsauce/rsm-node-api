const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const {DOMParser} = require("xmldom");

const fetch = require("./fetch");
const createItems = require("./CreateItems");
const encode64 = require("./encode64");
const fakersm = require("./fake").response;

const RSM_CREATEITEMS_PATH = "/AppController/commands_RSM/api/api_createItem.php";
const RSM_HOST = "https://localhost";

describe("RSM CreateItems", () => {
  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("should create two items", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{result: "OK", itemID: [9,10]}])));

    const response = await createItems("fakeapi", RSM_HOST)
      .item({"54": "something", "83": "otherthing"})
      .item({"54": "potatoes", "83": "breakfast"})
      .send();

    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_CREATEITEMS_PATH, {
      RStoken: "fakeapi",
      RSdata: `54:${encode64("something")};83:${encode64("otherthing")},54:${encode64("potatoes")};83:${encode64("breakfast")}`
    })).to.be.true;
    expect(response).to.deep.equal(["9","10"]);
  });

  it("should return permission denied", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{result: "NOK", description: "YOU DONT HAVE PERMISSIONS TO CREATE THIS ITEM"}])));

    await expect(
      createItems("otherfakeapi", RSM_HOST)
      .item({"53": "something", "66": "otherthing"})
      .item({"53": "potatoes", "68": "breakfast"})
      .send()
    ).to.be.rejectedWith("NOK");

    expect(stub.calledOnceWithExactly( RSM_HOST, RSM_CREATEITEMS_PATH,{
      RStoken: "otherfakeapi",
      RSdata: `53:${encode64("something")};66:${encode64("otherthing")},53:${encode64("potatoes")};68:${encode64("breakfast")}`
    })).to.be.true;
  });

  it("should return Connection Failure", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .rejects(new Error("Request Failed"));

    await expect(
      createItems("otherfakeapi", RSM_HOST)
        .item({"53": "something", "66": "otherthing"})
        .send()
    ).to.be.rejectedWith("Request Failed");

    expect(stub.calledOnceWithExactly( RSM_HOST, RSM_CREATEITEMS_PATH,{
      RStoken: "otherfakeapi",
      RSdata: `53:${encode64("something")};66:${encode64("otherthing")}`
    })).to.be.true;
  });
});
