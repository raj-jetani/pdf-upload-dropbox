// const pdf = require("puppeteer");
const express = require("express");
const pdf = require("html-pdf");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

var access_token = "sl.Ba91RMFrrwD3w8akxKjjhB6dE9iomEXe7fCEQayZVrnJqasNDe5_XloyM6w9oI10UnllhQOw53N5sPffA1TxNAImBwN9mrPKkY3n5r1vl6-Gdu38gvqCFDVRrf-EFllgGDYkhEIEeYzK"

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/download", (req, res) => {

  console.log(req.body);
  ejs.renderFile(
    path.join(__dirname, "/views/", "license.ejs"),
    {
      fullName: req.body.fullName,
      registeredAt: req.body.registeredAt,
      date: req.body.date,
      printName: req.body.printName,
      title: req.body.title,
      date2: req.body.date2,
      printName2: req.body.printName2,
      title2: req.body.title2,
    },
    async (err, result) => {
      // console.log(result)
      if (result) {
        var pdfName = `test-${Date.now()}.pdf`;
        pdf.create(result).toFile(`./pdfs/${pdfName}`, function (err, data) {
          if (err) {
            res.send(err);
          } else {
            var filename = "test.pdf";
            var content = fs.readFileSync(`./pdfs/${pdfName}`);
            res.send("file created successfully");
            options = {
              method: "POST",
              url: "https://content.dropboxapi.com/2/files/upload",
              headers: {
                "Content-Type": "application/octet-stream",
                Authorization: "Bearer " + access_token,
                "Dropbox-API-Arg":
                  '{"path": "/pdf/' +
                  pdfName +
                  '","mode": "overwrite","autorename": true,"mute": false}',
              },
              body: content,
            };

            request(options, function (err, res, body) {
              console.log("Err : " + err);
              console.log("res : " + res);
              console.log("body : " + body);
            });
          }
        });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on 3000 port");
});
