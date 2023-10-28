import express from "express";
import fs from "fs";

const app = express();

app.get("*", function (request, response) {
  const root = process.cwd();
  const path = request.originalUrl;

  if (path === "/list") {
    response.json(fs.readdirSync(root + "/test/cases", { withFileTypes: true }).filter(dirent => dirent.isFile()).map(dirent => dirent.name));
  } else if (path.startsWith("/code/") || path.startsWith("/test/")) {
    response.sendFile(root + path);
  } else if (path.length > 1) {
    response.sendFile(root + "/demo" + path);
  } else {
    response.sendFile(root + "/demo/demo.html");
  }
})

app.listen(3000);
console.log("Demo started at http://localhost:3000");
