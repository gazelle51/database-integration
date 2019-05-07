import mongodb, { MongoClient, Db } from "mongodb";
import winston from "../config/winston";

export const setUpDatabase = (): Promise<any> => {
  let mongoClient = mongodb.MongoClient;

  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/setUpDatabase");

      mongoClient.connect(
        process.env.MONGO_URL,
        JSON.parse(process.env.MONGO_OPTIONS),
        async (err: Error, client: MongoClient) => {
          if (err) return reject(err);

          winston.info(`Setting up database: ${process.env.MONGO_DATABASE}`);

          let db = client.db(process.env.MONGO_DATABASE);

          // Create collections
          await createCustomerCollection(db);
          await createROSyncCollection(db);
          await createPackageCollection(db);
          await createDocumentCollection(db);
          await createCreditMemorandumCollection(db);
          await createTemplateCollection(db);
          await createDictionaryCollection(db);
          await createLogsCollection(db);

          // Close database connection
          client.close();
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

export default { setUpDatabase };

/**
 * Create customer collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createCustomerCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createCustomerCollection");

      db.createCollection(
        "customer",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: ["customerID", "abn", "businessName"],
              properties: {
                customerID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                abn: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                businessName: {
                  bsonType: "string",
                  description: "must be a string and is required"
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("customer collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Create ROSync collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createROSyncCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createROSyncCollection");

      db.createCollection(
        "ROSync",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: [
                "syncID",
                "customerID",
                "status",
                "createdUnixTimestamp",
                "createdBy",
                "OOriginalValues",
                "ONewValues"
              ],
              properties: {
                syncID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                customerID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                status: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                createdUnixTimestamp: {
                  bsonType: "date",
                  description: "must be a date and is required"
                },
                createdBy: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                OOriginalValues: {
                  bsonType: "object",
                  description: "must be an object and is required"
                },
                ONewValues: {
                  bsonType: "object",
                  description: "must be an object and is required"
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("ROSync collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Create package collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createPackageCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createPackageCollection");

      db.createCollection(
        "package",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: [
                "packageID",
                "customerID",
                "status",
                "createdUnixTimestamp",
                "createdBy"
              ],
              properties: {
                packageID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                customerID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                status: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                createdUnixTimestamp: {
                  bsonType: "date",
                  description: "must be a date and is required"
                },
                createdBy: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                summarisedFieldsOriginal: {
                  bsonType: "array",
                  description: "must be an array and is not required",
                  minItems: 1,
                  items: {
                    bsonType: "object",
                    required: ["name", "value"],
                    properties: {
                      name: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      value: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      cloneName: {
                        bsonType: "string",
                        description: "muse be a string and is not required"
                      }
                    }
                  }
                },
                summarisedFieldsConfirmed: {
                  bsonType: "array",
                  description: "must be an array and is not required",
                  minItems: 1,
                  items: {
                    bsonType: "object",
                    required: ["name", "value"],
                    properties: {
                      name: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      value: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      cloneName: {
                        bsonType: "string",
                        description: "muse be a string and is not required"
                      }
                    }
                  }
                },
                confirmedUnixTimestamp: {
                  bsonType: "date",
                  description: "must be a date and is not required"
                },
                confirmedBy: {
                  bsonType: "string",
                  description: "must be a string and is not required"
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("package collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Create document collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createDocumentCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createDocumentCollection");

      db.createCollection(
        "document",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: ["documentID", "packageID", "originalPdf"],
              properties: {
                documentID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                packageID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                originalPdf: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                ocrPdf: {
                  bsonType: "string",
                  description: "must be a string and is not required"
                },
                datacapFields: {
                  bsonType: "array",
                  description: "must be an array and is not required",
                  minItems: 1,
                  items: {
                    bsonType: "object",
                    required: [
                      "category",
                      "rowLabel",
                      "columnLabel",
                      "value",
                      "confidence"
                    ],
                    properties: {
                      category: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      rowLabel: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      columnLabel: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      value: {
                        bsonType: "string",
                        description: "muse be a string and is required"
                      },
                      confidence: {
                        bsonType: "double",
                        description: "muse be a double and is required"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("document collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Create creditMemorandum collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createCreditMemorandumCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createCreditMemorandumCollection");

      db.createCollection(
        "creditMemorandum",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: [
                "creditMemorandumID",
                "packageID",
                "createdUnixTimestamp",
                "createdBy",
                "creditMemorandum",
                "fields"
              ],
              properties: {
                creditMemorandumID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                packageID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                createdUnixTimestamp: {
                  bsonType: "date",
                  description: "must be a date and is required"
                },
                createdBy: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                creditMemorandum: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                fields: {
                  bsonType: "object",
                  description: "must be an object and is required",
                  required: [
                    "summaryCustomerGroupName",
                    "summaryBorrower"
                  ],
                  properties: {
                    summaryCustomerGroupName: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    }
                  }
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("creditMemorandum collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Create template collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createTemplateCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createTemplateCollection");

      db.createCollection(
        "template",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: [
                "templateID",
                "description",
                "fileExtenstion",
                "document",
                "createdUnixTimestamp"
              ],
              properties: {
                templateID: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                description: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                fileExtenstion: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                document: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                createdUnixTimestamp: {
                  bsonType: "date",
                  description: "must be a date and is required"
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("template collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Create dictionary collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createDictionaryCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createDictionaryCollection");

      db.createCollection(
        "dictionary",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: ["lemma", "surfaceForms"],
              properties: {
                lemma: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                surfaceForms: {
                  bsonType: "array",
                  description: "must be an array and is required",
                  minItems: 1,
                  items: {
                    bsonType: "string",
                    description: "must be a string"
                  }
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("dictionary collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Create logs collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createLogsCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createLogsCollection");

      db.createCollection(
        "logs",
        {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: ["unixTimestamp", "level", "message"],
              properties: {
                traceID: {
                  bsonType: "string",
                  description: "must be a string and is not required"
                },
                unixTimestamp: {
                  bsonType: "date",
                  description: "must be a date and is required"
                },
                level: {
                  bsonType: "string",
                  description: "must be a string and is required"
                },
                message: {
                  bsonType: "string",
                  description: "must be a string and is required"
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("logs collection created");
          return resolve();
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};
