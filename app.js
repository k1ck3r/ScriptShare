const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyparser = require("body-parser");
const Enmap = require("enmap");
const Level = require("enmap-level");
const path = require("path");
const port = process.env.PORT || 1200;

http.codes = new Enmap({ provider: new Level({ name: "codes" }) });

app
.use(bodyparser.json())
.use(bodyparser.urlencoded({ extended: true }))
.engine("html", require("ejs").renderFile)
.set("view engine", "ejs")
.use(express.static(path.join(__dirname, "/public")))
.use("/", require("./router/index"))
.use("/api", require("./router/api"))
.use("/codes", require("./router/codes"));

http.listen(port, function (err) {
  if (err) return console.log(err);
  console.log(`ScriptShare started on port :::${port}:::`);
});

process.on("unhandledRejection", (r) => {
  console.dir(r);
});