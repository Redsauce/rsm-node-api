const nock = require("nock");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const createItems = require("./CreateItems");
const encode64 = require("./encode64");
const fakersm = require("./fake").response;
const matchForm = require("./testMatchForm");
const {checkIfNockIsUsed} = require('./support');

const RSM_CREATEITEMS_PATH = "/AppController/commands_RSM/api/api_createItem.php";
const RSM_HOST = "https://localhost";

afterEach(() => {
  checkIfNockIsUsed(nock);
});

describe("RSM CreateItems", () => {
  it("should create two items", async () => {
    const scope = nock(RSM_HOST)
      .post(RSM_CREATEITEMS_PATH, (body) => {
        return matchForm(body, {
          RStoken: "fakeapi",
          RSdata: `54:${encode64("something")};83:${encode64("otherthing")},54:${encode64("potatoes")};83:${encode64("breakfast")}`
        })
      })
      .reply(200, fakersm([{result: "OK", itemID: [9,10]}]));
    const response = await createItems("fakeapi", RSM_HOST)
      .item({"54": "something", "83": "otherthing"})
      .item({"54": "potatoes", "83": "breakfast"})
      .send();

    expect(scope.isDone()).to.be.true;
    expect(response).to.deep.equal(["9","10"]);
  });

  it("should return permission denied", async () => {
    const scope = nock(RSM_HOST)
      .post(RSM_CREATEITEMS_PATH, (body) => {
        return matchForm(body, {
          RStoken: "otherfakeapi",
          RSdata: `53:${encode64("something")};66:${encode64("otherthing")},53:${encode64("potatoes")};68:${encode64("breakfast")}`
        })
      })
      .reply(200, fakersm([{result: "NOK", description: "YOU DONT HAVE PERMISSIONS TO CREATE THIS ITEM"}]));

    await expect(
      createItems("otherfakeapi", RSM_HOST)
        .item({"53": "something", "66": "otherthing"})
        .item({"53": "potatoes", "68": "breakfast"})
        .send()
    ).to.be.rejectedWith("NOK");
    expect(scope.isDone()).to.be.true;
  });

  it("should return Connection Failure", async () => {
    const scope = nock(RSM_HOST)
      .post(RSM_CREATEITEMS_PATH, (body) => {
        return matchForm(body, {
          RStoken: "otherfakeapi",
          RSdata: `53:${encode64("something")};66:${encode64("otherthing")}`
        })
      })
      .replyWithError("Request Failed")

    await expect(
      createItems("otherfakeapi", RSM_HOST)
        .item({"53": "something", "66": "otherthing"})
        .send()
    ).to.be.rejectedWith("Request Failed");
    expect(scope.isDone()).to.be.true;
  });
});
