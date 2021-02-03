const nock = require("nock");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const deleteItem = require("./DeleteItem");
const fakersm = require("./fake").response;
const matchForm = require("./testMatchForm");
const {checkIfNockIsUsed} = require('./support');

const RSM_DELETEITEM_PATH = "/AppController/commands_RSM/api/api_deleteItem.php";

afterEach(() => {
  checkIfNockIsUsed(nock);
});

describe("RSM DeleteItem", () => {
  it("should delete an item", async () => {
    const scope = nock("https://host")
      .post(RSM_DELETEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          itemTypeID: "333",
          itemID: "2",
        })
      })
      .reply(200, fakersm([{result: "OK"}]));
    const response = await deleteItem("fakeapi", "https://host", "333")
      .delete("2");

    expect(scope.isDone()).to.be.true;
    expect(response).to.equal("OK");
  });

  it("should return permission denied", async () => {
    const scope = nock("https://host")
      .post(RSM_DELETEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          itemTypeID: "333",
          itemID: "2",
        })
      })
      .reply(200, fakersm([{result: "NOK"}]));

    await expect(
      deleteItem("fakeapi", "https://host", "333")
        .delete("2")
    ).to.be.rejectedWith("NOK");
    expect(scope.isDone()).to.be.true;
  });

  it("should return connection failure", async () => {
    const scope = nock("https://host")
      .post(RSM_DELETEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          itemTypeID: "1234",
          itemID: "4321",
        })
      })
      .replyWithError("Request failed!");

    await expect(
      deleteItem("fakeapi", "https://host", "1234")
        .delete("4321")
    ).to.be.rejectedWith("Request failed!");
    expect(scope.isDone()).to.be.true;
  });
});
