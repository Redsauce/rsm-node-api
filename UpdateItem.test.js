/**
 * @jest-environment node
 */

const nock = require("nock");
const {checkIfNockIsUsed} = require('./support');

const updateItem = require("./UpdateItem");
const encode64 = require("./encode64");
const fakersm = require("./fake").response;
const matchForm = require("./testMatchForm");

const RSM_UPDATEITEM_PATH = "/AppController/commands_RSM/api/api_updateItem.php";

afterEach(() => {
  checkIfNockIsUsed(nock);
});

describe("RSM UpdateItem", () => {
  it("should update an item", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_UPDATEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          RSitemID: "2",
          RSdata: `54:${encode64("something")};83:${encode64("otherthing")}`
        })
      })
      .reply(200, fakersm([{result: "OK"}]));
    const response = await updateItem("fakeapi")
      .update("2", {
        "54": "something",
        "83": "otherthing"
      });

    expect(scope.isDone()).toBe(true);
    expect(response).toEqual("OK");
  });

  it("should return permission denied", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_UPDATEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          RSitemID: "2",
          RSdata: `54:${encode64("something")};83:${encode64("otherthing")}`
        })
      })
      .reply(200, fakersm([{result: "NOK"}]));

    await expect(updateItem("fakeapi")
      .update("2", {
        "54": "something",
        "83": "otherthing"
      })).rejects.toEqual("NOK");
    expect(scope.isDone()).toBe(true);
  });

  it("should return connection failure", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_UPDATEITEM_PATH, (body) => {
        return matchForm(body, {
          RStoken: "token!",
          RSitemID: "1337",
          RSdata: `22:${encode64("potatoes")}`
        })
      })
      .replyWithError("Request failed!");

    await expect(updateItem("token!")
      .update("1337", {
        "22": "potatoes",
      })).rejects.toThrow("Request failed!");
    expect(scope.isDone()).toBe(true);
  });
});
