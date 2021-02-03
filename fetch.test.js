const {fetch} = require("./fetch");
const nock = require("nock");
const {checkIfNockIsUsed} = require('./support');
const expect = require("chai").expect;

const RSM_HOST = "http://localhost";

describe("RSM Fetch", () => {
  afterEach(() => {
    checkIfNockIsUsed(nock);
  });

  it("should send correct request", async () => {
    const scope = nock(RSM_HOST, {
      reqheaders: {
        'content-type': /^multipart\/form-data; boundary=/i
      }
    }).post("/target", (body) => {
      return body.includes('name="Test"\r\n\r\nAlbert\r\n')
        && body.includes('name="Data"\r\n\r\nEinstein\r\n')
    }).reply(200, "<p></p>");

    await fetch(RSM_HOST, "/target", {"Test": "Albert", "Data": "Einstein"});

    expect(scope.isDone()).to.be.true;
  });


  it("should parse a DOM removing <br> tags", async () => {
    nock(RSM_HOST).post("/target")
      .reply(200, "<p id='main'>Hi, I'm<br>Tuna Man</p>");

    const res = await fetch(RSM_HOST, "/target", {});
    expect(res.getElementById("main").textContent)
      .to.equal("Hi, I'm\nTuna Man")
  });
});
