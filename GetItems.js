const encode64 = require("./encode64");
const _ = require("lodash");
const RSM_Fetch = require("./fetch").fetch;
const RSM_ParseResponse = require("./parse_response");

const RSM_GETITEMS_PATH = "/AppController/commands_RSM/api/api_getItems.php";

function RSM_Encode_Filters(filters) {
  if ((typeof filters) === "undefined") {
    return
  }
  return filters.map(
    (filter) => [filter.property, encode64(filter.value), filter.mode].join(";")
  ).join(",");
}

function RSM_GetItems(host, path, request, props) {
  return new Promise(function (resolve, reject) {
    RSM_Fetch(host, path, request).then(function (response) {
      resolve(RSM_ParseResponse(props, response));
    }, function (error) {
      reject(error);
    });
  });
}

function formatProperties(props){
  return Object.values(props)
    .map(prop => prop.toString().replace("trs", ""))
    .filter((prop, index, self) => self.indexOf(prop) === index)
    .join(",");
}

function RSM_GetItemsBuilder(api_token, host) {
  return {
    request: {
      RStoken: api_token,
      properties: undefined,
      filters: undefined,
      filterJoining: "AND",
      extfilters: undefined,
    },
    host,
    path: RSM_GETITEMS_PATH,
    properties: function (props) {
      let new_request = _.cloneDeep(this);
      new_request.request.properties = props;
      return new_request;
    },
    filters: function (new_filters, join_mode) {
      let new_request = _.cloneDeep(this);
      new_request.request.filters = new_filters;
      if ((typeof join_mode) !== "undefined") {
        new_request.request.filterJoining = join_mode;
      }
      return new_request;
    },
    extFilters: function (new_extfilters) {
      let new_request = _.cloneDeep(this);
      new_request.request.extfilters = new_extfilters;
      return new_request;
    },
    fetch: function () {
      // Adapt request to RSM format
      const request = {
        RStoken: this.request.RStoken,
        propertyIDs: formatProperties(this.request.properties),
        filterRules: RSM_Encode_Filters(this.request.filters),
        extFilterRules: RSM_Encode_Filters(this.request.extfilters),
      }
      if (Object.values(this.request.properties).some(value => value.toString().endsWith("trs"))) {
        request.translateIDs= "true";
      }
      if (request.filterRules) {
        request.filterJoining = this.request.filterJoining;
      }
      return RSM_GetItems(this.host, this.path, request, _.invert(this.request.properties));
    }
  }
}

module.exports = RSM_GetItemsBuilder;
