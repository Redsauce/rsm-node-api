/**
 * @jest-environment node
 */

const nock = require("nock");

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
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_DELETEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          itemTypeID: "333",
          itemID: "2",
        })
      })
      .reply(200, fakersm([{result: "OK"}]));
    const response = await deleteItem("fakeapi", "333")
      .delete("2");

    expect(scope.isDone()).toBe(true);
    expect(response).toEqual("OK");
  });

  it("should return permission denied", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_DELETEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          itemTypeID: "333",
          itemID: "2",
        })
      })
      .reply(200, fakersm([{result: "NOK"}]));

    await expect(
      deleteItem("fakeapi", "333")
        .delete("2")
    ).rejects.toEqual("NOK");
    expect(scope.isDone()).toBe(true);
  });

  it("should return connection failure", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_DELETEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          itemTypeID: "1234",
          itemID: "4321",
        })
      })
      .replyWithError("Request failed!");

    await expect(
      deleteItem("fakeapi", "1234")
        .delete("4321")
    ).rejects.toThrow("Request failed!");
    expect(scope.isDone()).toBe(true);
  });
});
