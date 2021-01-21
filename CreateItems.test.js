/**
 * @jest-environment node
 */

const nock = require("nock");

const createItems = require("./CreateItems");
const encode64 = require("./encode64");
const fakersm = require("./fake").response;
const matchForm = require("./testMatchForm");
const {checkIfNockIsUsed} = require('./support');

const RSM_CREATEITEMS_PATH = "/AppController/commands_RSM/api/api_createItem.php";

afterEach(() => {
  checkIfNockIsUsed(nock);
});

describe("RSM CreateItems", () => {
  it("should create two items", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_CREATEITEMS_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          RSdata: `54:${encode64("something")};83:${encode64("otherthing")},54:${encode64("potatoes")};83:${encode64("breakfast")}`
        })
      })
      .reply(200, fakersm([{result: "OK", itemID: [9,10]}]));
    const response = await createItems("fakeapi")
      .item({"54": "something", "83": "otherthing"})
      .item({"54": "potatoes", "83": "breakfast"})
      .send();

    expect(scope.isDone()).toBe(true);
    expect(response).toEqual(["9","10"]);
  });

  it("should return permission denied", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_CREATEITEMS_PATH, (body) => {
        return matchForm(body, {
          RStoken: "otherfakeapi",
          RSdata: `53:${encode64("something")};66:${encode64("otherthing")},53:${encode64("potatoes")};68:${encode64("breakfast")}`
        })
      })
      .reply(200, fakersm([{result: "NOK", description: "YOU DONT HAVE PERMISSIONS TO CREATE THIS ITEM"}]));

    await expect(
      createItems("otherfakeapi")
        .item({"53": "something", "66": "otherthing"})
        .item({"53": "potatoes", "68": "breakfast"})
        .send()
    ).rejects.toEqual("NOK");
    expect(scope.isDone()).toBe(true);
  });

  it("should return Connection Failure", async () => {
    const scope = nock("https://rsm1.redsauce.net")
      .post(RSM_CREATEITEMS_PATH, (body) => {
        return matchForm(body, {
          RStoken: "otherfakeapi",
          RSdata: `53:${encode64("something")};66:${encode64("otherthing")}`
        })
      })
      .replyWithError("Request Failed")

    await expect(
      createItems("otherfakeapi")
        .item({"53": "something", "66": "otherthing"})
        .send()
    ).rejects.toThrow("Request Failed");
    expect(scope.isDone()).toBe(true);
  });
});
