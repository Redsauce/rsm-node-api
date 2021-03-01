# RSM API

This API works by generating Objects with the request data, which are finally sent to RSM through an action (like `fetch()` or `delete()`).

These Objects may be saved at any intermediate point and reused as necessary.

The Parent Object, which you must always create to use this API is the RSM Object, and all other objects are created from it.

For specific usage examples, please check out the `*.test.js` files.

# Node Installation

`yarn add rsm-api`

or 

`npm install rsm-api`

then you can import as `import RSM from "rsm-api"` or `const {RSM} = require("rsm-api")`

# Browser Installation

You will need to download the [rsm.js](rsm.js) file and include it in your project.

To use it, you must include it in a script tag:

`<script src="/rsm.js"></script>`

and then, you can import it where needed as `const {RSM} = require("rsm")` (this require function is exported by a bundled [browserify](https://browserify.org) automatically).

# API

## new RSM(token, host)

Returns an RSM Object initialized with the given RSM-API token for the given host, which contains the functions that allow for the other Objects to be created.

### rsm.createItems()

Returns an RSM Object ready to send a CreateItems request, on which `item` can be called any number of times to add items for creation and `send` sends the request to the server.

### rsm.createItems().item({propertyID1: value1, ..., propertyIDN, valueN})

Adds an item to be created with the passed properties containing the given values.

### rsm.createItems().fetch()

Sends the request to the host located in the created `rsm` Object.

The function returns a Promise, which is resolved with an Array containing the IDs of the created items.

In case of any errors, the Promise is rejected and a "NOK" message.

### rsm.deleteItem(type)

Returns an RSM Object ready to send a DeleteItem request for the given typeID, on which `delete` can be called to send a request to the server to delete a specific ID.

### rsm.deleteItem(type).delete(ID)

Sends the request to the host located in the created `rsm` Object to delete the item of the chosen type with the specified ID.

The function returns a Promise, which is resolved with an "OK" message if successful.

In case of any errors, the Promise is rejected and a "NOK" message.

### rsm.getItems()

Returns an RSM Object ready to send a GetItems request, on which `properties`, `filters` and `extFilters` can be called in any order and `fetch` sends the request to the server.

### rsm.getItems().properties({"name": id, "name2": id2, ...})

Returns a new RSM Object with the requested property IDs prepared in the GetItems request and aliased to the given names.

### rsm.getItems().filters([{property: id, mode: string, value: val}])

Returns a new RSM Object with the requested filters attached to it, where each filter acts on the property with the given ID according to the mode and value selected. For more information on the modes, see the RSM documentation.

### rsm.getItems().extFilters([{property: id, mode: string, value: val}])

Same as `filters` but for external filters.

### rsm.getItems().fetch()

Sends the request to the host located in the created `rsm` Object.

The function returns a Promise, which is resolved with an Array containing the items, which are Objects where the keys are the property aliases and the values are whatever their stored values are in the database.

In case of any errors, the Promise is rejected.

### rsm.getItem(type)

Returns an RSM Object ready to send a GetItem request for objects of the given type ID, on which `fetch` can be called to send the request to the server.

### rsm.getItem(type).fetch(id)

Sends the request to the host located in the created `rsm` Object.

The function returns a Promise, which is resolved with an Object where the keys are the property ids and the values are whatever their stored values are in the database.

In case of any errors, the Promise is rejected.

### rsm.getPicture(id)

Sends a request to the host located in the created `rsm` Object to the special getPicture endpoint.

The function returns a Promise, which is resolved to a stream containing the image with the given id.

In case of any errors, the Promise is rejected.

### rsm.updateItem(type)

Returns an RSM Object ready to send an UpdateItem request for objects of the given type ID, on which `update` can be called to send the request to the server.

### rsm.updateItem(type).update(id, newProps)

Sends the request to the host located in the created `rsm` Object to modify the item with the given id using the newProps given as an object of the type `{propID1: val1, ..., propIDN: valN}`.

The function returns a Promise, which is resolved when the update is performed successfully.

In case of any errors, the Promise is rejected.
