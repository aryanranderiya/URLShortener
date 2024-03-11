const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const linksSchema = new mongoose.Schema({
  shortURL: { type: String, required: true, unique: true, index: true },
  longURL: { type: String, required: true },
  createdAt: { type: Date },
  expireAt: { type: Date },
});

linksSchema.index({
  shortURL: "text",
});

const Link = mongoose.model("Links", linksSchema);

const connectDatabase = async () => {
  const connectionString = process.env.MONGO_DB;
  try {
    await mongoose.connect(connectionString);
    console.log("Successfully Connected!");
  } catch (error) {
    console.error(error);
  }
};

const insertIntoDatabase = async (
  shortURL,
  longURL,
  expireAfterSeconds = null
) => {
  connectDatabase();
  const [currentTime, expiryTime] = await calculateTime(expireAfterSeconds);

  console.log("current time", currentTime);
  console.log("expiration time", expiryTime);

  try {
    let link = new Link({
      shortURL: shortURL,
      longURL: longURL,
      createdAt: currentTime,
      expireAt: expiryTime,
    });

    await link.save();

    createIndex();

    console.log(`Successfully Inserted short URL "${shortURL}"!`);
  } catch (error) {
    console.log(error);
  }
};

const searchDatabase = async (query) => {
  try {
    connectDatabase();

    console.log("Searching Database...", query);
    const result = await Link.findOne({ shortURL: query });

    console.log(
      result
        ? `Search result ${query} found in database!`
        : `${query} not found! Returning NULL.`
    );

    return result ? result.longURL : null;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

async function createIndex() {
  const exists = await Link.collection.indexExists("expireAt");

  if (!exists) {
    await Link.collection.createIndex(
      { expireAt: 1 },
      { expireAfterSeconds: 0 },
      { background: true }
    );
  }
}

async function calculateTime(expireAfterSeconds) {
  console.log(expireAfterSeconds);

  var expiryTime = null;
  const currentTime = new Date();

  if (expireAfterSeconds !== null) {
    console.log("inside cond");
    expireAfterSeconds = parseInt(expireAfterSeconds);
    expiryTime = new Date(currentTime.getTime() + expireAfterSeconds * 1000);
  }

  const object = [currentTime, expiryTime];
  return object;
}

module.exports = { connectDatabase, insertIntoDatabase, searchDatabase };
