const mongodb = require("mongodb");
const appRoot = require("app-root-path");
const path = require("path");

let mongoClient = mongodb.MongoClient;
let oldDb = "scheduled_review";
let newDb = "scheduledReviewPOC";
let completeCopies = 0;
let collectionsToCopy = 5; // Calculated beforehand

// Load .env file
require("dotenv").config({ path: path.join(appRoot.toString(), ".env") });

mongoClient.connect(
  process.env.MONGO_URL_BEN,
  JSON.parse(process.env.MONGO_OPTIONS_BEN),
  async (err, client) => {
    if (err) return err;

    console.log(`Copying data from ${oldDb} into ${newDb}...\n`);

    let db = client.db(oldDb);
    let dbNew = client.db(newDb);

    db.listCollections().toArray((err, collections) => {
      if (err) throw err;

      // For each collection
      collections.forEach(collection => {
        // Check the collection is not "system.indexes"
        if (collection.name !== "system.indexes") {
          // Find collection data
          db.collection(collection.name)
            .find({})
            .toArray((err, result) => {
              if (err) throw err;

              // Upload data to new DB if it exists
              if (result.length && result) {
                dbNew
                  .collection(collection.name)
                  .insertMany(result, (err, jobResult) => {
                    if (err) throw err;

                    console.log(
                      `Number of docs inserted to ${
                        collection.name
                      } collection: ${jobResult.insertedCount}\n`
                    );

                    completeCopies = completeCopies + 1;
                    if (completeCopies === collectionsToCopy) {
                      console.log(`Data transfer complete!`);
                      client.close();
                    }
                  });
              }
            });
        }
      });
    });
  }
);
