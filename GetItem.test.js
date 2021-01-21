/**
 * @jest-environment node
 */

const getItem = require("./GetItem");

const RSM_GETITEM_PATH = "/AppController/commands_RSM/api/api_getItem.php";

// for mocking
const fetch = require("./fetch");
jest.mock('./fetch');

function fake_fetch() {
  return {
    then: () => {},
  }
}
fetch.mockImplementation(fake_fetch);

describe("RSM GetItem", () => {
  it("fetches correctly", () => {
    getItem("fakeapi", "type").fetch(3);

    expect(fetch).toHaveBeenLastCalledWith(RSM_GETITEM_PATH, {
      "RStoken": "fakeapi",
      "itemTypeID": "type",
      "itemID": 3,
    });
  });
});

