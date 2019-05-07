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
          await createRfsbOptimistSyncCollection(db);
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
 * Create rfsbOptimistSync collection in database.
 * @function
 * @param db - Mongo database to create collection in
 */
const createRfsbOptimistSyncCollection = (db: Db): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      winston.debug("/services/mongodb/createRfsbOptimistSyncCollection");

      db.createCollection(
        "rfsbOptimistSync",
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
                "optimistOriginalValues",
                "optimistNewValues"
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
                optimistOriginalValues: {
                  bsonType: "object",
                  description: "must be an object and is required"
                },
                optimistNewValues: {
                  bsonType: "object",
                  description: "must be an object and is required"
                }
              }
            }
          }
        },
        function(err, res) {
          if (err) return reject(err);
          winston.info("rfsbOptimistSync collection created");
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
                    "summaryBorrower",
                    "summaryDeptNameRegionNoBranchNo",
                    "summaryReferralSource",
                    "summaryAccountManagerOIC",
                    "summaryDate",
                    "summaryDateOfLastCM",
                    "summaryNextReviewDate",
                    "summaryANZSIC",
                    "summaryCustomerSince",
                    "summaryBorrower1Name",
                    "summaryBorrower1CurrentTAE",
                    "summaryBorrower1ProposedTAE",
                    "summaryBorrower1Change",
                    "summaryBorrower1CrossCollateral",
                    "summaryBorrower1CurrentCRGSRG",
                    "summaryBorrower1ProposedCRGSRG",
                    "summaryBorrower2Name",
                    "summaryBorrower2CurrentTAE",
                    "summaryBorrower2ProposedTAE",
                    "summaryBorrower2Change",
                    "summaryBorrower2CrossCollateral",
                    "summaryBorrower2CurrentCRGSRG",
                    "summaryBorrower2ProposedCRGSRG",
                    "summaryTotalCurrentTAE",
                    "summaryTotalProposedTAE",
                    "summaryTotalChange",
                    "summaryTotalCrossCollateral",
                    "summaryBorrower1SecurityValue",
                    "summaryBorrower1LVR",
                    "summaryBorrower1XTVPercent",
                    "summaryBorrower1XTV",
                    "summaryBorrower1TAEXTV",
                    "summaryBorrower2SecurityValue",
                    "summaryBorrower2LVR",
                    "summaryBorrower2XTVPercent",
                    "summaryBorrower2XTV",
                    "summaryBorrower2TAEXTV",
                    "summaryTotalSecurityValue",
                    "summaryTotalLVR",
                    "summaryTotalXTVPercent",
                    "summaryTotalXTV",
                    "summaryTotalTAEXTV",
                    "section6GroupEntityName",
                    "section6StatementDate1",
                    "section6StatementDate2",
                    "section6StatementDate3",
                    "section6SummaryIncomeStatement1",
                    "section6SummaryIncomeStatement2",
                    "section6SummaryIncomeStatement3",
                    "section6SummaryIncomeStatementProjection",
                    "section6Revenue1",
                    "section6Revenue2",
                    "section6Revenue3",
                    "section6RevenueProjection",
                    "section6EBIT1",
                    "section6EBIT2",
                    "section6EBIT3",
                    "section6EBITProjection",
                    "section6EBITDA1",
                    "section6EBITDA2",
                    "section6EBITDA3",
                    "section6EBITDAProjection",
                    "section6NetProfitAfterTax1",
                    "section6NetProfitAfterTax2",
                    "section6NetProfitAfterTax3",
                    "section6NetProfitAfterTaxProjection",
                    "section6SummaryUCACashFlow1",
                    "section6SummaryUCACashFlow2",
                    "section6SummaryUCACashFlow3",
                    "section6SummaryUCACashFlowProjection",
                    "section6NetCashAfterOperations1",
                    "section6NetCashAfterOperations2",
                    "section6NetCashAfterOperations3",
                    "section6NetCashAfterOperationsProjection",
                    "section6ChangeNetFixedAssets1",
                    "section6ChangeNetFixedAssets2",
                    "section6ChangeNetFixedAssets3",
                    "section6ChangeNetFixedAssetsProjection",
                    "section6SummaryBalanceSheet1",
                    "section6SummaryBalanceSheet2",
                    "section6SummaryBalanceSheet3",
                    "section6SummaryBalanceSheetProjection",
                    "section6TotalAssets1",
                    "section6TotalAssets2",
                    "section6TotalAssets3",
                    "section6TotalAssetsProjection",
                    "section6SeniorDebt1",
                    "section6SeniorDebt2",
                    "section6SeniorDebt3",
                    "section6SeniorDebtProjection",
                    "section6TotalLiabilities1",
                    "section6TotalLiabilities2",
                    "section6TotalLiabilities3",
                    "section6TotalLiabilitiesProjection",
                    "section6NetWorth1",
                    "section6NetWorth2",
                    "section6NetWorth3",
                    "section6NetWorthProjection",
                    "section6SummaryKeyFinancialRatios1",
                    "section6SummaryKeyFinancialRatios2",
                    "section6SummaryKeyFinancialRatios3",
                    "section6SummaryKeyFinancialRatiosProjection",
                    "section6CurrentRatio1",
                    "section6CurrentRatio2",
                    "section6CurrentRatio3",
                    "section6CurrentRatioProjection",
                    "section6InterestCover1",
                    "section6InterestCover2",
                    "section6InterestCover3",
                    "section6InterestCoverProjection",
                    "section6ForecastGearing1",
                    "section6ForecastGearing2",
                    "section6ForecastGearing3",
                    "section6ForecastGearingProjection",
                    "section6ProjectedInterestCover1",
                    "section6ProjectedInterestCover2",
                    "section6ProjectedInterestCover3",
                    "section6ProjectedInterestCoverProjection",
                    "section6ProjectedDSCR1",
                    "section6ProjectedDSCR2",
                    "section6ProjectedDSCR3",
                    "section6ProjectedDSCRProjection",
                    "section6Covenant1",
                    "section6Threshold1",
                    "section6Covenant2",
                    "section6Threshold2",
                    "section6Covenant3",
                    "section6Threshold3",
                    "section6SummaryCovenants1",
                    "section6SummaryCovenants2",
                    "section6SummaryCovenants3",
                    "section6Projection",
                    "section6CovenantThreshold1",
                    "section6CovenantThreshold2",
                    "section6CovenantThreshold3",
                    "section6CovenantThresholdProjection",
                    "section6CovenantThreshold11",
                    "section6CovenantThreshold12",
                    "section6CovenantThreshold13",
                    "section6CovenantThreshold1Projection",
                    "section6CovenantThreshold21",
                    "section6CovenantThreshold22",
                    "section6CovenantThreshold23",
                    "section6CovenantThreshold2Projection",
                    "section6CovenantThreshold31",
                    "section6CovenantThreshold32",
                    "section6CovenantThreshold33",
                    "section6CovenantThreshold3Projection",
                    "section10Date",
                    "section10CRGSRG",
                    "section10TotalTAE",
                    "section11CustomerLendingGroup",
                    "section11RatingModelUsed",
                    "section11ConsolidationPreparation",
                    "section11CRGPrevious",
                    "section11CRGSystemGenerated",
                    "section11Recommended",
                    "section11LeverageFY15",
                    "section11LeverageFY16",
                    "section11LeverageCRGImpact",
                    "section11InterestCoverFY15",
                    "section11InterestCoverFY16",
                    "section11InterestCoverCRGImpact",
                    "section11DebtServiceCoverFY15",
                    "section11DebtServiceCoverFY16",
                    "section11DebtServiceCoverCRGImpact",
                    "section13FacilityType1",
                    "section13BaseRate1",
                    "section13ScaleMargin1",
                    "section13Shading1",
                    "section13EffectiveRate1",
                    "section13FeeType1",
                    "section13ScaleFee1",
                    "section13Discount1",
                    "section13ResultantFee1",
                    "section13FacilityType2",
                    "section13BaseRate2",
                    "section13ScaleMargin2",
                    "section13Shading2",
                    "section13EffectiveRate2",
                    "section13FeeType2",
                    "section13ScaleFee2",
                    "section13Discount2",
                    "section13ResultantFee2",
                    "section13ExistingReturn",
                    "section13ProjectedReturn",
                    "section13MeetsPricingBenchmark",
                    "section13OutsideBenchmarkPricingApproved",
                    "annexureAFacilityType1",
                    "annexureALedger1",
                    "annexureACurrent1",
                    "annexureAProposed1",
                    "annexureAIRMargin1",
                    "annexureARepaymentArrangements1",
                    "annexureAFacilityType2",
                    "annexureALedger2",
                    "annexureACurrent2",
                    "annexureAProposed2",
                    "annexureAIRMargin2",
                    "annexureARepaymentArrangements2",
                    "annexureAFacilityType3",
                    "annexureALedger3",
                    "annexureACurrent3",
                    "annexureAProposed3",
                    "annexureAIRMargin3",
                    "annexureARepaymentArrangements3",
                    "annexureACurrentTotal",
                    "annexureAProposedTotal",
                    "annexureAIRMarginTotal",
                    "annexureARepaymentArrangementsTotal",
                    "annexureBCustomerGroupName",
                    "annexureBDeptRegionBranchNameNo",
                    "annexureBBorrowerPostCode",
                    "annexureBCustomerGroupNo",
                    "annexureBAccountManagerOic",
                    "annexureBTAEXTV",
                    "annexureBBorrowerName1",
                    "annexureBBusinessActivity1",
                    "annexureBCustomerNo1",
                    "annexureBANZSIC1",
                    "annexureBFacilityType11",
                    "annexureBLedger11",
                    "annexureBLoanPurposeCode11",
                    "annexureBCurrentBalance11",
                    "annexureBCurrentLimit11",
                    "annexureBProposedLimit11",
                    "annexureBMovement11",
                    "annexureBTerm11",
                    "annexureBMaturityDate11",
                    "annexureBRepaymentArrangement11",
                    "annexureBBaseRate11",
                    "annexureBMargin11",
                    "annexureBFacilityType12",
                    "annexureBLedger12",
                    "annexureBLoanPurposeCode12",
                    "annexureBCurrentBalance12",
                    "annexureBCurrentLimit12",
                    "annexureBProposedLimit12",
                    "annexureBMovement12",
                    "annexureBTerm12",
                    "annexureBMaturityDate12",
                    "annexureBRepaymentArrangement12",
                    "annexureBBaseRate12",
                    "annexureBMargin12",
                    "annexureBFacilityType13",
                    "annexureBLedger13",
                    "annexureBLoanPurposeCode13",
                    "annexureBCurrentBalance13",
                    "annexureBCurrentLimit13",
                    "annexureBProposedLimit13",
                    "annexureBMovement13",
                    "annexureBTerm13",
                    "annexureBMaturityDate13",
                    "annexureBRepaymentArrangement13",
                    "annexureBBaseRate13",
                    "annexureBMargin13",
                    "annexureBFacilityType14",
                    "annexureBLedger14",
                    "annexureBLoanPurposeCode14",
                    "annexureBCurrentBalance14",
                    "annexureBCurrentLimit14",
                    "annexureBProposedLimit14",
                    "annexureBMovement14",
                    "annexureBTerm14",
                    "annexureBMaturityDate14",
                    "annexureBRepaymentArrangement14",
                    "annexureBBaseRate14",
                    "annexureBMargin14",
                    "annexureBFacilityType15",
                    "annexureBLedger15",
                    "annexureBLoanPurposeCode15",
                    "annexureBCurrentBalance15",
                    "annexureBCurrentLimit15",
                    "annexureBProposedLimit15",
                    "annexureBMovement15",
                    "annexureBTerm15",
                    "annexureBMaturityDate15",
                    "annexureBRepaymentArrangement15",
                    "annexureBBaseRate15",
                    "annexureBMargin15",
                    "annexureBCurrentCurrentLimit1",
                    "annexureBCurrentProposedLimit1",
                    "annexureBCurrentMovement1",
                    "annexureBTermCurrentLimit1",
                    "annexureBTermProposedLimit1",
                    "annexureBTermMovement1",
                    "annexureBOtherCurrentLimit1",
                    "annexureBOtherProposedLimit1",
                    "annexureBOtherMovement1",
                    "annexureBBorrowerTAECurrentLimit1",
                    "annexureBBorrowerTAEProposedLimit1",
                    "annexureBBorrowerTAEMovement1",
                    "annexureBBorrowerName2",
                    "annexureBBusinessActivity2",
                    "annexureBCustomerNo2",
                    "annexureBANZSIC2",
                    "annexureBFacilityType21",
                    "annexureBLedger21",
                    "annexureBLoanPurposeCode21",
                    "annexureBCurrentBalance21",
                    "annexureBCurrentLimit21",
                    "annexureBProposedLimit21",
                    "annexureBMovement21",
                    "annexureBTerm21",
                    "annexureBMaturityDate21",
                    "annexureBRepaymentArrangement21",
                    "annexureBBaseRate21",
                    "annexureBMargin21",
                    "annexureBFacilityType22",
                    "annexureBLedger22",
                    "annexureBLoanPurposeCode22",
                    "annexureBCurrentBalance22",
                    "annexureBCurrentLimit22",
                    "annexureBProposedLimit22",
                    "annexureBMovement22",
                    "annexureBTerm22",
                    "annexureBMaturityDate22",
                    "annexureBRepaymentArrangement22",
                    "annexureBBaseRate22",
                    "annexureBMargin22",
                    "annexureBFacilityType23",
                    "annexureBLedger23",
                    "annexureBLoanPurposeCode23",
                    "annexureBCurrentBalance23",
                    "annexureBCurrentLimit23",
                    "annexureBProposedLimit23",
                    "annexureBMovement23",
                    "annexureBTerm23",
                    "annexureBMaturityDate23",
                    "annexureBRepaymentArrangement23",
                    "annexureBBaseRate23",
                    "annexureBMargin23",
                    "annexureBFacilityType24",
                    "annexureBLedger24",
                    "annexureBLoanPurposeCode24",
                    "annexureBCurrentBalance24",
                    "annexureBCurrentLimit24",
                    "annexureBProposedLimit24",
                    "annexureBMovement24",
                    "annexureBTerm24",
                    "annexureBMaturityDate24",
                    "annexureBRepaymentArrangement24",
                    "annexureBBaseRate24",
                    "annexureBMargin24",
                    "annexureBFacilityType25",
                    "annexureBLedger25",
                    "annexureBLoanPurposeCode25",
                    "annexureBCurrentBalance25",
                    "annexureBCurrentLimit25",
                    "annexureBProposedLimit25",
                    "annexureBMovement25",
                    "annexureBTerm25",
                    "annexureBMaturityDate25",
                    "annexureBRepaymentArrangement25",
                    "annexureBBaseRate25",
                    "annexureBMargin25",
                    "annexureBCurrentCurrentLimit2",
                    "annexureBCurrentProposedLimit2",
                    "annexureBCurrentMovement2",
                    "annexureBTermCurrentLimit2",
                    "annexureBTermProposedLimit2",
                    "annexureBTermMovement2",
                    "annexureBOtherCurrentLimit2",
                    "annexureBOtherProposedLimit2",
                    "annexureBOtherMovement2",
                    "annexureBBorrowerTAECurrentLimit2",
                    "annexureBBorrowerTAEProposedLimit2",
                    "annexureBBorrowerTAEMovement2",
                    "annexureBTAECurrentLimits",
                    "annexureBTAEProposedLimits",
                    "annexureBTAEMovement",
                    "annexureBOAECurrentLimits",
                    "annexureBOAEProposedLimits",
                    "annexureBOAEMovement",
                    "annexureBTOTALCurrentLimits",
                    "annexureBTOTALProposedLimits",
                    "annexureBTOTALMovement",
                    "annexureBAccountType1",
                    "annexureBAccountNo1",
                    "annexureBInterestRateCode1",
                    "annexureBExposureTypeCode1",
                    "annexureBRiskWeighting1",
                    "annexureBCommercialPropertyCode1",
                    "annexureBAccountType2",
                    "annexureBAccountNo2",
                    "annexureBInterestRateCode2",
                    "annexureBExposureTypeCode2",
                    "annexureBRiskWeighting2",
                    "annexureBCommercialPropertyCode2",
                    "annexureBBorrowingEntity1",
                    "annexureBLender1",
                    "annexureBFacilityType1",
                    "annexureBFacilityAmount1",
                    "annexureBSecurityType1",
                    "annexureBSecurityMV1",
                    "annexureBBorrowingEntity2",
                    "annexureBLender2",
                    "annexureBFacilityType2",
                    "annexureBFacilityAmount2",
                    "annexureBSecurityType2",
                    "annexureBSecurityMV2",
                    "annexureEDate1",
                    "annexureEDate2",
                    "annexureEDate3",
                    "annexureEDate4",
                    "annexureEDate5",
                    "annexureERating1",
                    "annexureERating1Date1",
                    "annexureERating1Date2",
                    "annexureERating1Date3",
                    "annexureERating1Date4",
                    "annexureERating1Date5",
                    "annexureERating2",
                    "annexureERating2Date1",
                    "annexureERating2Date2",
                    "annexureERating2Date3",
                    "annexureERating2Date4",
                    "annexureERating2Date5",
                    "annexureERating3",
                    "annexureERating3Date1",
                    "annexureERating3Date2",
                    "annexureERating3Date3",
                    "annexureERating3Date4",
                    "annexureERating3Date5",
                    "annexureECurrentCustomer",
                    "annexureECurrentSecurity",
                    "annexureEProposedModel",
                    "annexureEProposedOverride",
                    "annexureESecurityXTV",
                    "annexureESecurityRiskRating",
                    "annexureEOverallRiskRating",
                    "annexureFBusinessUnit",
                    "annexureFCustomerGroupName",
                    "annexureFBorrower",
                    "annexureFDate",
                    "annexureFAccountManager",
                    "annexureFTAE"
                  ],
                  properties: {
                    summaryCustomerGroupName: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryDeptNameRegionNoBranchNo: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryReferralSource: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryAccountManagerOIC: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryDate: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryDateOfLastCM: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryNextReviewDate: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryANZSIC: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryCustomerSince: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1Name: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1CurrentTAE: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1ProposedTAE: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1Change: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1CrossCollateral: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1CurrentCRGSRG: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1ProposedCRGSRG: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2Name: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2CurrentTAE: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2ProposedTAE: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2Change: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2CrossCollateral: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2CurrentCRGSRG: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2ProposedCRGSRG: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalCurrentTAE: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalProposedTAE: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalChange: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalCrossCollateral: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1SecurityValue: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1LVR: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1XTVPercent: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1XTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower1TAEXTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2SecurityValue: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2LVR: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2XTVPercent: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2XTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryBorrower2TAEXTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalSecurityValue: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalLVR: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalXTVPercent: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalXTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    summaryTotalTAEXTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6GroupEntityName: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6StatementDate1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6StatementDate2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6StatementDate3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryIncomeStatement1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryIncomeStatement2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryIncomeStatement3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryIncomeStatementProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Revenue1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Revenue2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Revenue3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6RevenueProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBIT1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBIT2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBIT3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBITProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBITDA1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBITDA2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBITDA3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6EBITDAProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetProfitAfterTax1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetProfitAfterTax2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetProfitAfterTax3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetProfitAfterTaxProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryUCACashFlow1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryUCACashFlow2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryUCACashFlow3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryUCACashFlowProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetCashAfterOperations1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetCashAfterOperations2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetCashAfterOperations3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetCashAfterOperationsProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ChangeNetFixedAssets1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ChangeNetFixedAssets2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ChangeNetFixedAssets3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ChangeNetFixedAssetsProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryBalanceSheet1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryBalanceSheet2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryBalanceSheet3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryBalanceSheetProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalAssets1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalAssets2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalAssets3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalAssetsProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SeniorDebt1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SeniorDebt2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SeniorDebt3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SeniorDebtProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalLiabilities1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalLiabilities2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalLiabilities3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6TotalLiabilitiesProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetWorth1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetWorth2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetWorth3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6NetWorthProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryKeyFinancialRatios1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryKeyFinancialRatios2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryKeyFinancialRatios3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryKeyFinancialRatiosProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CurrentRatio1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CurrentRatio2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CurrentRatio3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CurrentRatioProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6InterestCover1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6InterestCover2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6InterestCover3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6InterestCoverProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ForecastGearing1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ForecastGearing2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ForecastGearing3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ForecastGearingProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedInterestCover1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedInterestCover2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedInterestCover3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedInterestCoverProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedDSCR1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedDSCR2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedDSCR3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6ProjectedDSCRProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Covenant1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Threshold1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Covenant2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Threshold2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Covenant3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Threshold3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryCovenants1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryCovenants2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6SummaryCovenants3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6Projection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThresholdProjection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold1Projection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold2Projection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold31: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold32: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold33: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section6CovenantThreshold3Projection: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section10Date: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section10CRGSRG: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section10TotalTAE: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11CustomerLendingGroup: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11RatingModelUsed: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11ConsolidationPreparation: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11CRGPrevious: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11CRGSystemGenerated: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11Recommended: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11LeverageFY15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11LeverageFY16: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11LeverageCRGImpact: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11InterestCoverFY15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11InterestCoverFY16: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11InterestCoverCRGImpact: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11DebtServiceCoverFY15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11DebtServiceCoverFY16: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section11DebtServiceCoverCRGImpact: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13FacilityType1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13BaseRate1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ScaleMargin1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13Shading1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13EffectiveRate1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13FeeType1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ScaleFee1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13Discount1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ResultantFee1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13FacilityType2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13BaseRate2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ScaleMargin2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13Shading2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13EffectiveRate2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13FeeType2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ScaleFee2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13Discount2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ResultantFee2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ExistingReturn: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13ProjectedReturn: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13MeetsPricingBenchmark: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    section13OutsideBenchmarkPricingApproved: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAFacilityType1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureALedger1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureACurrent1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAProposed1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAIRMargin1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureARepaymentArrangements1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAFacilityType2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureALedger2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureACurrent2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAProposed2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAIRMargin2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureARepaymentArrangements2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAFacilityType3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureALedger3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureACurrent3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAProposed3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAIRMargin3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureARepaymentArrangements3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureACurrentTotal: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAProposedTotal: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureAIRMarginTotal: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureARepaymentArrangementsTotal: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCustomerGroupName: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBDeptRegionBranchNameNo: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerPostCode: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCustomerGroupNo: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBAccountManagerOic: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTAEXTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerName1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBusinessActivity1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCustomerNo1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBANZSIC1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin11: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin12: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin13: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin14: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin15: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentCurrentLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentProposedLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentMovement1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTermCurrentLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTermProposedLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTermMovement1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOtherCurrentLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOtherProposedLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOtherMovement1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerTAECurrentLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerTAEProposedLimit1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerTAEMovement1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerName2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBusinessActivity2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCustomerNo2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBANZSIC2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin21: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin22: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin23: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin24: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLedger25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLoanPurposeCode25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentBalance25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentLimit25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBProposedLimit25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMovement25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTerm25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMaturityDate25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRepaymentArrangement25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBaseRate25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBMargin25: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentCurrentLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentProposedLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCurrentMovement2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTermCurrentLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTermProposedLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTermMovement2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOtherCurrentLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOtherProposedLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOtherMovement2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerTAECurrentLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerTAEProposedLimit2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowerTAEMovement2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTAECurrentLimits: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTAEProposedLimits: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTAEMovement: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOAECurrentLimits: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOAEProposedLimits: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBOAEMovement: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTOTALCurrentLimits: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTOTALProposedLimits: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBTOTALMovement: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBAccountType1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBAccountNo1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBInterestRateCode1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBExposureTypeCode1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRiskWeighting1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCommercialPropertyCode1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBAccountType2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBAccountNo2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBInterestRateCode2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBExposureTypeCode2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBRiskWeighting2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBCommercialPropertyCode2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowingEntity1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLender1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityAmount1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBSecurityType1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBSecurityMV1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBBorrowingEntity2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBLender2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityType2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBFacilityAmount2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBSecurityType2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureBSecurityMV2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEDate1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEDate2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEDate3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEDate4: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEDate5: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating1Date1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating1Date2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating1Date3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating1Date4: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating1Date5: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating2Date1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating2Date2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating2Date3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating2Date4: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating2Date5: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating3Date1: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating3Date2: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating3Date3: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating3Date4: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureERating3Date5: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureECurrentCustomer: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureECurrentSecurity: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEProposedModel: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEProposedOverride: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureESecurityXTV: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureESecurityRiskRating: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureEOverallRiskRating: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureFBusinessUnit: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureFCustomerGroupName: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureFBorrower: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureFDate: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureFAccountManager: {
                      bsonType: "string",
                      description: "must be a string and is required"
                    },
                    annexureFTAE: {
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
