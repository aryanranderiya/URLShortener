const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { insertIntoDatabase, searchDatabase } = require("./database");

const app = express();
// const PORT = process.env.PORT;
const PORT = 5000;

app.use(cors());

app.use(express.json());

app.listen(PORT, (error) => {
  if (error) console.log("Server Could not Start!" + error);
  else console.log("Server successfully started! Listening on port " + PORT);
});

app.post("/insert", async (req, res) => {
  const { shortURL, longURL, expireAfterSeconds } = req.body;

  console.log("Short URL: ", shortURL);
  console.log("Long URL: ", longURL);
  console.log("Expiration Time: ", expireAfterSeconds);

  const searchResult = await searchDatabase(shortURL);

  if (searchResult === null) {
    console.log("No Redundant Data Found...Inserting Into Database!");
    insertIntoDatabase(shortURL, longURL, expireAfterSeconds);
    res.end();
  } else {
    res
      .status(409)
      .json({ error: "Short Link Already Exists! Please try again." });
  }
});

app.get("/l/*", async (req, res) => {
  const url = req.params[0];
  console.log("URL Parameter:", url);
  console.log("URL Parameter Type:", typeof url);

  if (url && url !== "/") {
    const longURL = await searchDatabase(url);
    console.log(longURL);

    if (longURL !== null) res.redirect(longURL);
    else res.redirect("https://aryanranderiya.com/404");
  } else {
    res.redirect("https://aryanranderiya.com/404");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
