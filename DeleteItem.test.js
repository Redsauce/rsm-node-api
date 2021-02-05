const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const {DOMParser} = require("xmldom");

const fetch = require("./fetch");
const deleteItem = require("./DeleteItem");
const fakersm = require("./fake").response;

const RSM_DELETEITEM_PATH = "/AppController/commands_RSM/api/api_deleteItem.php";
const RSM_HOST = "https://localhost";

describe("RSM DeleteItem", () => {

  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("should delete an item", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{result: "OK"}])));

    const response = await deleteItem("fakeapi", RSM_HOST, "333")
      .delete("2");

    expect(response).to.equal("OK");
    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_DELETEITEM_PATH, {
      RStoken: "fakeapi",
      itemTypeID: "333",
      itemID: "2",
    })).to.be.true;
  });

  it("should return permission denied", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .resolves(new DOMParser()
        .parseFromString(
          fakersm([{result: "NOK"}])));

    await expect(
      deleteItem("fakeapi", RSM_HOST, "333")
        .delete("2")
    ).to.be.rejectedWith("NOK");

    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_DELETEITEM_PATH, {
      RStoken: "fakeapi",
      itemTypeID: "333",
      itemID: "2",
    })).to.be.true;
  });

  it("should return connection failure", async () => {
    const stub = sandbox.stub(fetch, "fetch")
      .rejects(new Error("Request failed!"));

    await expect(
      deleteItem("fakeapi", RSM_HOST, "1234")
        .delete("4321")
    ).to.be.rejectedWith("Request failed!");
    expect(stub.calledOnceWithExactly(RSM_HOST, RSM_DELETEITEM_PATH, {
      RStoken: "fakeapi",
      itemTypeID: "1234",
      itemID: "4321",
    })).to.be.true;
  });
});
