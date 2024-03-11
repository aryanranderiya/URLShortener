const express = require("express");
const cors = require("cors");
const path = require("path");
const { insertIntoDatabase, searchDatabase } = require("./database.js");
require("dotenv").config(); // Configure  Environment Variables

const app = express(); //Inititilise Express app
const PORT = process.env.PORT || 3000; // Fetch PORT Environment Variable

app.use(cors()); // Initiailise Cross Origin Resource Sharing from different domains
app.use(express.json()); // Initialise API responses to be in json format

// Set URL for the reat build files
app.use(
  express.static(path.join(__dirname, "../../Frontend/react-frontend/build"))
);

// Deliver the frontend build files at the base url
app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../../Frontend/react-frontend/build/static/index.html"
    )
  );
});

// Listen on PORT in .env
app.listen(PORT, (error) => {
  if (error) console.log("Server Could not Start!" + error);
  else console.log("Server successfully started! Listening on port " + PORT);
});

// Fetch the short link and redirect user
app.get("/l/*", async (req, res) => {
  // Fetch the first parameter in the url like "domain.com/l/FIRSTPARAMETER"
  const url = req.params[0];

  console.log("URL Parameter:", url);
  console.log("URL Parameter Type:", typeof url);

  // Search database if the shortURL is a valid entry or not
  const longURL = await searchDatabase(url);
  console.log(longURL);

  // If the shortURL has an associated longURL entry in the database then redirect to it
  if (longURL !== null) res.redirect(longURL);
  // Else redirect to 404 page
  else res.redirect("https://aryanranderiya.com/404");
});

// Insert into the database when Form is submitted using "fetch" in Frontend logic
app.post("/insert", async (req, res) => {
  const { shortURL, longURL, expireAfterSeconds } = req.body;

  console.log("Short URL: ", shortURL);
  console.log("Long URL: ", longURL);
  console.log("Expiration Time: ", expireAfterSeconds);

  // Search if the record already exists in the database to prevent redundancy
  const searchResult = await searchDatabase(shortURL);

  // Only Insert if the record doesn't already exists
  if (searchResult === null) {
    console.log("No Redundant Data Found...Inserting Into Database!");
    insertIntoDatabase(shortURL, longURL, expireAfterSeconds);
    res.end(); // End the response stream or else it will keep reloading
  } else
    res
      .status(409)
      .json({ error: "Short Link Already Exists! Please try again." }); // Alert the user with a custom error if the url already exists
});

// Export the app module
module.exports = app;
