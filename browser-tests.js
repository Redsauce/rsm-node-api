const browserify = require("browserify");
const fs = require("fs");
const path = require("path");

fs.mkdirSync("./browser", {recursive: true});
fs.readdirSync(".")
    .filter((f) => f.endsWith(".test.js"))
    .forEach((file) => {
        const stream = fs.createWriteStream(path.join("./browser/", file));
        browserify(file).bundle().pipeTo(stream);
        stream.close();
    });
