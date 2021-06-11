const sinon = require("sinon");
const expect = require("chai").expect;
const request = require("./request");
const GetPicture = require("./GetPicture");
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

describe("GetPicture", () => {

  let sandbox = sinon.createSandbox();
  afterEach(() => sandbox.restore());

  it("should return a stream", async () => {
    const stub = sandbox.stub(request, "fetch")
      .resolves({blob: () => superFakeBlob()});

    const res = await GetPicture("token", "https://notarealwebsite", "1337");
    expect(res).to.be.an.instanceOf(stream);

  });
});
