const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
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
      .resolves({ok: true, blob: () => superFakeBlob()});

    const res = await GetPicture("token", "https://notarealwebsite", "1337");
    expect(res).to.be.an.instanceOf(stream);

  });

  it("should error", async () => {
    const stub = sandbox.stub(request, "fetch")
      .resolves({ok: false, blob: () => superFakeBlob()});

    return expect(GetPicture("token", "https://notarealwebsite", "1337"))
      .to.be.rejected;

  });
});
