const mongoose = require("mongoose");
require("dotenv").config();

// Create a new Schema using the short & long URL alongside a creation and expiry date
const linksSchema = new mongoose.Schema({
  shortURL: { type: String, required: true, unique: true, index: true },
  longURL: { type: String, required: true },
  createdAt: { type: Date },
  expireAt: { type: Date },
});

// Enable indexing for the shortURL in order to perform "find" / search operation
linksSchema.index({
  shortURL: "text",
});

// Create a new Model named "link" based on the schema
const Link = mongoose.model("Links", linksSchema);

// Connect to MongoDB based on the environment variable in .env
const connectDatabase = async () => {
  const connectionString = process.env.MONGO_DB;
  try {
    await mongoose.connect(connectionString);
    console.log("Successfully Connected!");
  } catch (error) {
    console.error(error);
  }
};

// Insert the short & long URL into the database
const insertIntoDatabase = async (
  shortURL,
  longURL,
  expireAfterSeconds = null
) => {
  // Establish Connection
  connectDatabase();

  // Calculate the current time & expiration time for the link based on the user's expiration choice
  const [currentTime, expiryTime] = await calculateTime(expireAfterSeconds);

  console.log("current time", currentTime);
  console.log("expiration time", expiryTime);

  try {
    // Create a new object based on the Model
    let link = new Link({
      shortURL: shortURL,
      longURL: longURL,
      createdAt: currentTime,
      expireAt: expiryTime,
    });

    // Save the model (Perform the insertion)
    await link.save();

    // Create Index for auto-record deletion based on expiration date
    createIndex();

    console.log(`Successfully Inserted short URL "${shortURL}"!`);
  } catch (error) {
    console.log(error);
  }
};

// Search the database based on a specific query
const searchDatabase = async (query) => {
  try {
    // Establish Connection
    connectDatabase();

    console.log("Searching Database...", query);

    // perform 1 Search operation on the Link model that returns the first entry in the database
    const result = await Link.findOne({ shortURL: query });

    console.log(
      result
        ? `Search result ${query} found in database!`
        : `${query} not found! Returning NULL.`
    );

    // If the result exists then return it's longURL, else return null
    return result ? result.longURL : null;

    // End of try
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Create expiration date index
async function createIndex() {
  //Check if the Index "expireAT" already exists or not to prevent duplicate index creations
  const exists = await Link.collection.indexExists("expireAt");

  // If the index doesn't already exist then create it
  if (!exists) {
    await Link.collection.createIndex(
      { expireAt: 1 }, // The attribute to create an index of
      { expireAfterSeconds: 0 }, // Set expire after seconds to 0 so that it will expire 0 seconds after the previousy set expiration date of the record
      { background: true } // Perform index creation in the background
    );
  }
}

// Calculate currentTime and expiryTime based on the users input on the frontend
async function calculateTime(expireAfterSeconds) {
  console.log(expireAfterSeconds);

  var expiryTime = null; // Initialise to null (If "Never Expire" is selected)

  const currentTime = new Date(); // Create a new Date and assign to currentTime

  // Only if the user has selected anything other than "Never Expire"
  if (expireAfterSeconds !== null) {
    // Type cast the string to Integer
    expireAfterSeconds = parseInt(expireAfterSeconds);

    // Convert the currentTime to milliseconds and add the expiryseconds * 100
    // Multiply by 1000 to convert milliseconds to seconds
    expiryTime = new Date(currentTime.getTime() + expireAfterSeconds * 1000);
  }
  // Else: the initial value of null is stored in expiryTime

  // Return an object of the current time and the expiration time
  return [currentTime, expiryTime];
}

module.exports = { connectDatabase, insertIntoDatabase, searchDatabase };
