const sinon = require("sinon");
const expect = require("chai").expect;
const axios = require("axios");
const FormData = require("form-data");
const {isNode, isBrowser} = require("browser-or-node");

const {fetch} = require("./fetch");
const fakersm = require("./fake").response;

const RSM_HOST = "http://localhost";

function compareStreams(form1, form2) {
  let stream1, stream2;
  if (isNode) {
    stream1 = form1._streams.filter((s) => (typeof s) === "string")
      .map((s) => s.replace(form1._boundary, ""));
    stream2 = form2._streams.filter((s) => (typeof s) === "string")
      .map((s) => s.replace(form2._boundary, ""));
  } else if (isBrowser) {
    stream1 = Array.from(form1.entries());
    stream2 = Array.from(form2.entries());
  } else {
    throw new Error("Test only works on browser or node!")
  }
  expect(stream1).to.deep.equal(stream2);

  return true
}

describe("RSM Fetch", () => {

  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("should send correct request", async () => {
    const stub = sandbox.stub(axios, "post")
      .resolves({data: fakersm([])});
    const formdata = new FormData();
    formdata.append("Test", "Albert");
    formdata.append("Data", "Einstein");

    await fetch(RSM_HOST, "/target", {"Test": "Albert", "Data": "Einstein"});

    expect(stub.calledOnceWithExactly(RSM_HOST + "/target",
      sinon.match((data) => compareStreams(data, formdata)),
      sinon.match({headers: sinon.match({"content-type": sinon.match("multipart/form-data")})})
    )).to.be.true;
  });


  it("should parse a DOM removing <br> tags", async () => {
    const stub = sandbox.stub(axios, "post")
      .resolves({data: "<p id='main'>Hi, I'm<br>Tuna Man</p>"});

    const res = await fetch(RSM_HOST, "/whatever", {});
    expect(res.getElementById("main").textContent)
      .to.equal("Hi, I'm\nTuna Man")
  });
});
