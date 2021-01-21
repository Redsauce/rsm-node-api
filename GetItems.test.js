/**
 * @jest-environment node
 */

const getItems = require("./GetItems");

const RSM_GETITEMS_PATH = "/AppController/commands_RSM/api/api_getItems.php";

// for mocking
const fetch = require("./fetch");
jest.mock('./fetch');

function fake_fetch() {
  return {
    then: () => {},
  }
}
fetch.mockImplementation(fake_fetch);

describe("RSM GetItems", () => {
  it("fetches correctly", () => {
    getItems("fake api token", "host", "type")
      .properties({
        "Potato": 1337,
        "The Universe": 42,
      }).filters([
        {property: 1337, mode: "LIKE", value: "%potato%"},
      ])
      .fetch();

    expect(fetch).toHaveBeenLastCalledWith("host", RSM_GETITEMS_PATH, {
      "RStoken": "fake api token",
      "propertyIDs": "1337,42",
      "filterRules": "1337;JXBvdGF0byU=;LIKE",
      "extFilterRules": undefined,
      "filterJoining": "AND",
    });
  });
});
