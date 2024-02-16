/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
  updateDoc,
  setDoc,
  collection,
  getAggregateFromServer,
  sum,
} = require("firebase/firestore");
const { Query } = require("firebase-admin/firestore");

admin.initializeApp();

const db = admin.firestore();

exports.onDataTPS = onDocumentWritten(
  "/STATE/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/CHILDS/{state5}/CHILDS/TPS",
  async (event) => {
    try {
      const [afterData, beforeData] = [
        event.data.after.data(),
        event.data.before.data(),
      ];

      const { state1, state2, state3, state4, state5 } = event.params;

      //   Create
      if (beforeData == undefined) {
        const { valid, chart } = afterData;

        var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;

        var data = await db.doc(docId).get();
        if (!data.exists)
          return await db.doc(docId).update(
            {
              [valid ? "REAL" : "KPU"]: {
                anies: !chart ? 0 : chart[100025] || 0,
                prabowo: !chart ? 0 : chart[100026] || 0,
                ganjar: !chart ? 0 : chart[100027] || 0,
              },
            },
            { merge: true }
          );

        return await db.doc(docId).update(
          {
            [valid ? "REAL" : "KPU"]: {
              anies: (!chart ? 0 : chart[100025] || 0) + validData.data().anies,
              prabowo:
                (!chart ? 0 : chart[100026] || 0) + validData.data().prabowo,
              ganjar:
                (!chart ? 0 : chart[100027] || 0) + validData.data().ganjar,
            },
          },
          { merge: true }
        );
      }

      // //   Delete
      // if (afterData == undefined) {
      //   var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;

      //   return await db.doc(docId).delete();
      // }

      // //   Update

      // const { valid: beforeValid, chart: beforeChart } = beforeData;
      // const { valid: afterValid, chart: afterChart } = afterData;

      // var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;

      // if (afterValid == beforeValid && afterChart == beforeChart) {
      //   return;
      // }

      // if (afterValid != beforeValid) {
      //   await db.doc(`${docId}/${afterValid ? "INVALID" : "VALID"}`).delete();
      // }

      // await db.doc(`${docId}/${!afterValid ? "INVALID" : "VALID"}`).set({
      //   anies: !afterChart ? 0 : afterChart[100025] || 0,
      //   prabowo: !afterChart ? 0 : afterChart[100026] || 0,
      //   ganjar: !afterChart ? 0 : afterChart[100027] || 0,
      // });
    } catch (error) {}
  }
);

// const run = async ({ beforeData, afterData, data, docId, status }) => {
//   try {
//     var doc = await db
//       .collection(docId + "/DATA")
//       .select("invalid", "valid")
//       .get();

//     // await db.doc(docId).update({ valid, invalid }, { merge: true });

//     // //   Created
//     // if (beforeData == undefined) {
//     //   if (!data.exists) return await db.doc(docId).set(afterData);

//     //   return await db.doc(docId).set({
//     //     anies: (afterData.anies || 0) + data.data()?.anies || 0,
//     //     prabowo: (afterData.prabowo || 0) + data.data()?.prabowo || 0,
//     //     ganjar: (afterData.ganjar || 0) + data.data()?.ganjar || 0,
//     //   });
//     // }

//     // //   Deleted
//     // if (afterData == undefined) {
//     //   if (!data.exists) return;

//     //   return await db.doc(docId).set({
//     //     anies: -1 * (beforeData.anies || 0) + data.data()?.anies || 0,
//     //     prabowo: -1 * (beforeData.prabowo || 0) + data.data()?.prabowo || 0,
//     //     ganjar: -1 * (beforeData.ganjar || 0) + data.data()?.ganjar || 0,
//     //   });
//     // }

//     // //   Updated
//     // return await db.doc(docId).set({
//     //   anies:
//     //     -1 * (beforeData.anies || 0) +
//     //       (afterData.anies || 0) +
//     //       data.data()?.anies || 0,
//     //   prabowo:
//     //     -1 * (beforeData.prabowo || 0) +
//     //       (afterData.prabowo || 0) +
//     //       data.data()?.prabowo || 0,
//     //   ganjar:
//     //     -1 * (beforeData.ganjar || 0) +
//     //       (afterData.ganjar || 0) +
//     //       data.data()?.ganjar || 0,
//     // });
//   } catch (error) {}
// };

// exports.onState5 = onDocumentWritten(
//   "/INDONESIA/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/CHILDS/{state5}/DATA/{status}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, state2, state3, state4, status } = event.params;

//       var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}`;
//       var data = await db.doc(docId).get();

//       run({
//         beforeData,
//         afterData,
//         data,
//         docId,
//         status,
//       });
//     } catch (error) {}
//   }
// );

// exports.onState4 = onDocumentWritten(
//   "/INDONESIA/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/DATA/{status}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, state2, state3, status } = event.params;

//       var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/DATA/${status}`;
//       var data = await db.doc(docId).get();

//       run({
//         beforeData,
//         afterData,
//         data,
//         docId,
//       });
//     } catch (error) {}
//   }
// );

// exports.onState3 = onDocumentWritten(
//   "/INDONESIA/{state1}/CHILDS/{state2}/CHILDS/{state3}/DATA/{status}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, state2, status } = event.params;

//       var docId = `INDONESIA/${state1}/CHILDS/${state2}/DATA/${status}`;
//       var data = await db.doc(docId).get();

//       run({
//         beforeData,
//         afterData,
//         data,
//         docId,
//       });
//     } catch (error) {}
//   }
// );

// exports.onState2 = onDocumentWritten(
//   "/INDONESIA/{state1}/CHILDS/{state2}/DATA/{status}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, status } = event.params;

//       var docId = `INDONESIA/${state1}/DATA/${status}`;
//       var data = await db.doc(docId).get();

//       run({
//         beforeData,
//         afterData,
//         data,
//         docId,
//       });
//     } catch (error) {}
//   }
// );

// exports.onState1 = onDocumentWritten(
//   "/INDONESIA/{state1}/DATA/{status}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { status } = event.params;

//       var docId = `INDONESIA/${status}`;
//       var data = await db.doc(docId).get();

//       run({
//         beforeData,
//         afterData,
//         data,
//         docId,
//       });
//     } catch (error) {}
//   }
// );

// exports.onTPSCount = onDocumentWritten(
//   "/STATE/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/CHILDS/{state5}/CHILDS/TPS",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, state2, state3, state4, state5 } = event.params;

//       //   Create
//       if (beforeData == undefined) {
//         const { valid } = afterData;

//         var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;
//         var doc = await db.doc(docId).get();

//         if (doc.exists)
//           return await db.doc(docId).update(
//             {
//               valid: (doc.data()?.valid || 0) + valid ? 1 : 0,
//               invalid: (doc.data()?.invalid || 0) + valid ? 0 : 1,
//             },
//             { merge: true }
//           );
//       }

//       // Delete
//       if (afterData == undefined) {
//         const { valid } = beforeData;

//         var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;

//         var doc = await db.doc(docId).get();

//         if (doc.exists)
//           return await db.doc(docId).update(
//             {
//               valid: (doc.data()?.valid || 0) + (valid ? -1 : 0),
//               invalid: (doc.data()?.invalid || 0) + (valid ? 0 : -1),
//             },
//             { merge: true }
//           );
//         return;
//       }

//       //   Update

//       const beforeValid = beforeData.valid;
//       const afterValid = afterData.valid;

//       var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;

//       if (afterValid == beforeValid) {
//         return;
//       }

//       var doc = await db.doc(docId).get();

//       if (doc.exists)
//         await db.doc(docId).update(
//           {
//             valid: (doc.data()?.valid || 0) + (afterValid ? 1 : -1),
//             invalid: (doc.data()?.invalid || 0) + (afterValid ? -1 : 1),
//           },
//           { merge: true }
//         );
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// const runCount = async ({ afterData, beforeData, docId }) => {
//   try {
//     var doc = await db
//       .collection(docId + "/CHILDS")
//       .select("invalid", "valid")
//       .get();

//     var valid = 0,
//       invalid = 0;

//     var docs = doc.docs;
//     while (docs.length) {
//       var currentDoc = docs.shift();
//       if (currentDoc) {
//         valid += currentDoc.data()?.valid || 0;
//         invalid += currentDoc.data()?.invalid || 0;
//       }
//     }

//     await db.doc(docId).update({ valid, invalid }, { merge: true });
//   } catch (error) {}
// };

// exports.onTPSCount5 = onDocumentWritten(
//   "/STATE/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/CHILDS/{state5}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, state2, state3, state4 } = event.params;

//       var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}`;

//       await runCount({ afterData, beforeData, docId });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// exports.onTPSCount4 = onDocumentWritten(
//   "/STATE/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, state2, state3 } = event.params;

//       var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}`;

//       await runCount({ afterData, beforeData, docId });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// exports.onTPSCount3 = onDocumentWritten(
//   "/STATE/{state1}/CHILDS/{state2}/CHILDS/{state3}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1, state2 } = event.params;

//       var docId = `STATE/${state1}/CHILDS/${state2}`;

//       await runCount({ afterData, beforeData, docId });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// exports.onTPSCount2 = onDocumentWritten(
//   "/STATE/{state1}/CHILDS/{state2}",
//   async (event) => {
//     try {
//       const [afterData, beforeData] = [
//         event.data.after.data(),
//         event.data.before.data(),
//       ];

//       const { state1 } = event.params;

//       var docId = `STATE/${state1}`;

//       await runCount({ afterData, beforeData, docId });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// exports.onTPSCount1 = onDocumentWritten("/STATE/{state1}", async (event) => {
//   try {
//     const [afterData, beforeData] = [
//       event.data.after.data(),
//       event.data.before.data(),
//     ];

//     var docId = `DATA/ALL`;

//     await runCount({ afterData, beforeData, docId });
//   } catch (error) {
//     console.log(error);
//   }
// });
