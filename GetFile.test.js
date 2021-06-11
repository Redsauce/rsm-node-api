const sinon = require("sinon");
const expect = require("chai").expect;
const request = require("./request");
const GetFile = require("./GetFile");
const { Blob } = require('buffer');
const {isNode} = require("browser-or-node");
let stream;

if (isNode) {
  stream = require('stream').Readable;
} else {
  stream = ReadableStream;
}

function superFakeBlob() {
  return {
    stream: () => new stream([]),
  }
}

describe("GetFile", () => {

  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("should return a stream", async () => {
    const stub = sandbox.stub(request, "fetch")
      .resolves({blob: () => superFakeBlob()});

    const res = await GetFile("token", "https://notarealwebsite", "1337", "999");
    expect(res).to.be.an.instanceOf(stream);

  });
});

