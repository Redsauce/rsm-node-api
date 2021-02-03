const expect = require("chai").expect;
const {RSM} = require("./index");
const fakersm = require("./fake").http_request;
const testdata = require("./testdata/articles");

describe("RSM", () => {
  let rsm;
  beforeEach(() => {
    rsm = new RSM("SOMEAPIKEY");
  });

  it("can fetch content", async () => {
    const testcase = testdata["article list"];
    fakersm("getItems", 200, testcase["rsm"]);

    const res = await rsm.getItems().properties({
      "Title": 1467,
      "Content": 1468,
      "Date": 1469,
      "Authors": 1472,
      "Tags": 1474,
      "Friendly URL": 1476,
    }).fetch();

    const content = res[0]["Content"];
    expect(content).to.equal(testcase["expected response"][1]["Content"]);
    expect(res[0]["ID"]).to.equal(testcase["expected response"][1]["ID"]);
  });

  it("can reuse a call", async () => {
    const testcase = testdata["article list"];
    fakersm("getItems", 200, testcase["rsm"]);

    const all_articles = await rsm.getItems().properties({
      "Title": 1467,
      "Content": 1468,
      "Date": 1469,
      "Authors": 1472,
      "Tags": 1474,
      "Friendly URL": 1476,
    });

    const res = await all_articles.fetch();
    expect(res[1]["ID"]).to.equal(testcase["expected response"][0]["ID"]);

    fakersm("getItems", 200, testcase["rsm"]);
    const res2 = await all_articles.fetch();
    expect(res2[1]["ID"]).to.equal(testcase["expected response"][0]["ID"]);
  });

  it("can take filters", async () => {
    const testcase = testdata["article list"];
    fakersm("getItems", 200, testcase["rsm"]);

    const all_articles = await rsm.getItems().properties({
      "Title": 1467,
      "Content": 1468,
      "Date": 1469,
      "Authors": 1472,
      "Tags": 1474,
      "Friendly URL": 1476,
    });

    const res = await all_articles.filters([
      {property: 1467, mode: "LIKE", value: "%potato%"},
      {property: 1474, mode: "IN", value: "potato"},
    ], "OR").fetch();
    expect(res[1]["ID"]).to.equal(testcase["expected response"][0]["ID"]);
  });
});
