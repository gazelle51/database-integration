import mongodb, {
  MongoClient,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  FilterQuery,
  UpdateWriteOpResult,
  FindOneOptions,
  DeleteWriteOpResultObject
} from "mongodb";
import winston from "../config/winston";
import {
  MongoDBInsertOneSuccess,
  MongoDBInsertManySuccess,
  MongoDBUpdateSuccess,
  MongoDBDeleteSuccess
} from "../config/models/MongoDB";

/**
 * Insert a document into the specified collection.
 * @function
 * @param collection - Name of collection to insert into
 * @param document - Document to insert
 */
const insertOne = (
  collection: string,
  document: object
): Promise<MongoDBInsertOneSuccess> => {
  let data: MongoDBInsertOneSuccess;
  let mongoClient = mongodb.MongoClient;

  return new Promise((resolve, reject) => {
    try {
      winston.debug("/services/mongo/insertOne");

      if (
        ![
          "customer",
          "rfsbOptimistSync",
          "package",
          "document",
          "creditMemorandum",
          "template",
          "dictionary",
          "logs"
        ].includes(collection)
      ) {
        return reject(new Error("Collection does not exist in database"));
      }

      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          // Insert document
          client
            .db(process.env.MONGO_DATABASE)
            .collection(collection)
            .insertOne(
              document,
              (err: Error, result: InsertOneWriteOpResult) => {
                if (err) {
                  client.close();
                  return reject(err);
                }

                // Return ID of inserted document
                data = {
                  insertedID: result.ops[0]._id
                };
                client.close();
                return resolve(data);
              }
            );
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Insert many documents into the specified collection.
 * @function
 * @param collection - Name of collection to insert into
 * @param documents - Documents to insert
 */
const insertMany = (
  collection: string,
  documents: Array<object>
): Promise<MongoDBInsertManySuccess> => {
  let data: MongoDBInsertManySuccess;
  let mongoClient = mongodb.MongoClient;

  return new Promise((resolve, reject) => {
    try {
      winston.debug("/services/mongo/insertMany");

      if (
        ![
          "customer",
          "rfsbOptimistSync",
          "package",
          "document",
          "creditMemorandum",
          "template",
          "dictionary",
          "logs"
        ].includes(collection)
      ) {
        return reject(new Error("Collection does not exist in database"));
      }

      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          // Insert documents
          client
            .db(process.env.MONGO_DATABASE)
            .collection(collection)
            .insertMany(
              documents,
              (err: Error, result: InsertWriteOpResult) => {
                if (err) {
                  client.close();
                  return reject(err);
                }

                // Return IDs of inserted documents
                data = {
                  insertedIDs: result.insertedIds
                };
                client.close();
                return resolve(data);
              }
            );
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Query documents in a specified collection. Options can be used to sort results, retrieve specific fields, limit results, etc..
 * @function
 * @param collection - Name of collection to query
 * @param query - Query object outlining query to perform
 * @param fields - Fields to retrieve, optional - defaults to all fields
 * @param options - Query options, optional - defaults to no options
 */
const query = (
  collection: string,
  query: FilterQuery<any>,
  fields: object = {},
  options: FindOneOptions = {}
): Promise<Array<any>> => {
  let mongoClient = mongodb.MongoClient;

  return new Promise((resolve, reject) => {
    try {
      winston.debug("/services/mongo/query");

      // Connect to MongoDB
      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          // Query collection
          client
            .db(process.env.MONGO_DATABASE)
            .collection(collection)
            .find(query, options)
            .project(fields)
            .toArray((err: Error, result: Array<any>) => {
              if (err) {
                client.close();
                return reject(err);
              }
              return resolve(result);
            });
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Update a specified document.
 * @function
 * @param collection - Name of collection document to update belongs to
 * @param query - Query to find document to update
 * @param update - New values to update in document
 */
const updateOne = (
  collection: string,
  query: FilterQuery<any>,
  update: object
): Promise<MongoDBUpdateSuccess> => {
  return new Promise(async (resolve, reject) => {
    let mongoClient = mongodb.MongoClient;

    try {
      winston.debug("/services/mongo/updateOne");

      // Connect to MongoDB
      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          // Update document
          client
            .db(process.env.MONGO_DATABASE)
            .collection(collection)
            .updateOne(
              query,
              { $set: update },
              (err: Error, result: UpdateWriteOpResult) => {
                if (err) {
                  client.close();
                  return reject(err);
                }
                return resolve(result.result);
              }
            );
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Update many specified documents.
 * @function
 * @param collection - Name of collection documents to update belong to
 * @param query - Query to find documents to update
 * @param update - New values to update in all documents
 */
const updateMany = (
  collection: string,
  query: FilterQuery<any>,
  update: object
): Promise<MongoDBUpdateSuccess> => {
  return new Promise(async (resolve, reject) => {
    let mongoClient = mongodb.MongoClient;

    try {
      winston.debug("/services/mongo/updateOne");

      // Connect to MongoDB
      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          // Update document
          client
            .db(process.env.MONGO_DATABASE)
            .collection(collection)
            .updateMany(
              query,
              { $set: update },
              (err: Error, result: UpdateWriteOpResult) => {
                if (err) {
                  client.close();
                  return reject(err);
                }
                return resolve(result.result);
              }
            );
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Delete a specified document.
 * @function
 * @param collection - Name of collection document to delete belongs to
 * @param query - Query to find document to delete
 */
const deleteOne = (
  collection: string,
  query: FilterQuery<any>
): Promise<MongoDBDeleteSuccess> => {
  return new Promise(async (resolve, reject) => {
    let mongoClient = mongodb.MongoClient;

    try {
      winston.debug("/services/mongo/deleteOne");

      // Connect to MongoDB
      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          // Delete document
          client
            .db(process.env.MONGO_DATABASE)
            .collection(collection)
            .deleteOne(
              query,
              (err: Error, result: DeleteWriteOpResultObject) => {
                if (err) {
                  client.close();
                  return reject(err);
                }
                return resolve(result.result);
              }
            );
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Delete all specified documents.
 * @function
 * @param collection - Name of collection documents to delete belong to
 * @param query - Query to find documents to delete
 */
const deleteMany = (
  collection: string,
  query: FilterQuery<any>
): Promise<MongoDBDeleteSuccess> => {
  return new Promise(async (resolve, reject) => {
    let mongoClient = mongodb.MongoClient;

    try {
      winston.debug("/services/mongo/deleteMany");

      // Connect to MongoDB
      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          // Delete document
          client
            .db(process.env.MONGO_DATABASE)
            .collection(collection)
            .deleteMany(
              query,
              (err: Error, result: DeleteWriteOpResultObject) => {
                if (err) {
                  client.close();
                  return reject(err);
                }
                return resolve(result.result);
              }
            );
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

export default {
  insertOne,
  insertMany,
  query,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany
};
