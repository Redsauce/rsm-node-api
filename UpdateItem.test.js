const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require("sinon");
const {DOMParser} = require("xmldom");

const fetch = require("./fetch");
const updateItem = require("./UpdateItem");
const encode64 = require("./encode64");
const fakersm = require("./fake").response;

const RSM_UPDATEITEM_PATH = "/AppController/commands_RSM/api/api_updateItem.php";
const RSM_HOST = "http://localhost"

describe("RSM UpdateItem", () => {

  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("should update an item", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{result: "OK"}])));

    const response = await updateItem("fakeapi", RSM_HOST, "1212")
      .update("2", {
        "54": "something",
        "83": "otherthing"
      });

    expect(response).to.equal("OK");
    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_UPDATEITEM_PATH, {
      RStoken: "fakeapi",
      itemTypeID: "1212",
      RSitemID: "2",
      RSdata: `54:${encode64("something")};83:${encode64("otherthing")}`
    })).to.be.true;
  });

  it("should return permission denied", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{result: "NOK"}])));

    await expect(updateItem("fakeapi", RSM_HOST, "52")
      .update("2", {
        "54": "something",
        "83": "otherthing"
      })).to.be.rejectedWith("NOK");

    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_UPDATEITEM_PATH, {
      RStoken: "fakeapi",
      itemTypeID: "52",
      RSitemID: "2",
      RSdata: `54:${encode64("something")};83:${encode64("otherthing")}`
    })).to.be.true;
  });

  it("should return connection failure", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .rejects(new Error("Request failed!"))

    await expect(updateItem("token!", RSM_HOST, "23")
      .update("1337", {
        "22": "potatoes",
      })).to.be.rejectedWith("Request failed!");

    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_UPDATEITEM_PATH, {
      RStoken: "token!",
      itemTypeID: "23",
      RSitemID: "1337",
      RSdata: `22:${encode64("potatoes")}`
    })).to.be.true;
  });
});
