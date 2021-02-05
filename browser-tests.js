const browserify = require("browserify");
const fs = require("fs");
const path = require("path");

fs.mkdirSync("./browser", {recursive: true});
fs.readdirSync(".")
    .filter((f) => f.endsWith(".test.js"))
    .forEach((file) => {
        const target = path.join("./browser/", file);
        const stream = fs.createWriteStream(target);
        console.log(file, "=>", target);
        browserify(file).bundle().pipe(stream);
    });
