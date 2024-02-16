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

        var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}/DATA/${
          valid ? "VALID" : "INVALID"
        }`;

        var data = await db.doc(docId).get();
        if (!data.exists)
          return await db.doc(docId).set({
            anies: !chart ? 0 : chart[100025] || 0,
            prabowo: !chart ? 0 : chart[100026] || 0,
            ganjar: !chart ? 0 : chart[100027] || 0,
          });

        return await db.doc(docId).set({
          anies: (!chart ? 0 : chart[100025] || 0) + validData.data().anies,
          prabowo: (!chart ? 0 : chart[100026] || 0) + validData.data().prabowo,
          ganjar: (!chart ? 0 : chart[100027] || 0) + validData.data().ganjar,
        });
      }

      //   Delete
      if (afterData == undefined) {
        const { valid } = beforeData;

        var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}/DATA/${
          valid ? "VALID" : "INVALID"
        }`;

        return await db.doc(docId).delete();
      }

      //   Update

      const { valid: beforeValid, chart: beforeChart } = beforeData;
      const { valid: afterValid, chart: afterChart } = afterData;

      var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}/DATA`;

      if (afterValid == beforeValid && afterChart == beforeChart) {
        return;
      }

      if (afterValid != beforeValid) {
        await db.doc(`${docId}/${afterValid ? "INVALID" : "VALID"}`).delete();
      }

      await db.doc(`${docId}/${!afterValid ? "INVALID" : "VALID"}`).set({
        anies: !afterChart ? 0 : afterChart[100025] || 0,
        prabowo: !afterChart ? 0 : afterChart[100026] || 0,
        ganjar: !afterChart ? 0 : afterChart[100027] || 0,
      });
    } catch (error) {}
  }
);

const run = async ({ beforeData, afterData, data, docId }) => {
  try {
    //   Created
    if (beforeData == undefined) {
      if (!data.exists) return await db.doc(docId).set(afterData);

      return await db.doc(docId).set({
        anies: (afterData.anies || 0) + data.data()?.anies || 0,
        prabowo: (afterData.prabowo || 0) + data.data()?.prabowo || 0,
        ganjar: (afterData.ganjar || 0) + data.data()?.ganjar || 0,
      });
    }

    //   Deleted
    if (afterData == undefined) {
      if (!data.exists) return;

      return await db.doc(docId).set({
        anies: -1 * (beforeData.anies || 0) + data.data()?.anies || 0,
        prabowo: -1 * (beforeData.prabowo || 0) + data.data()?.prabowo || 0,
        ganjar: -1 * (beforeData.ganjar || 0) + data.data()?.ganjar || 0,
      });
    }

    //   Updated
    return await db.doc(docId).set({
      anies:
        -1 * (beforeData.anies || 0) +
          (afterData.anies || 0) +
          data.data()?.anies || 0,
      prabowo:
        -1 * (beforeData.prabowo || 0) +
          (afterData.prabowo || 0) +
          data.data()?.prabowo || 0,
      ganjar:
        -1 * (beforeData.ganjar || 0) +
          (afterData.ganjar || 0) +
          data.data()?.ganjar || 0,
    });
  } catch (error) {}
};

exports.onState5 = onDocumentWritten(
  "/INDONESIA/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/CHILDS/{state5}/DATA/{status}",
  async (event) => {
    try {
      const [afterData, beforeData] = [
        event.data.after.data(),
        event.data.before.data(),
      ];

      const { state1, state2, state3, state4, status } = event.params;

      var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/DATA/${status}`;
      var data = await db.doc(docId).get();

      run({
        beforeData,
        afterData,
        data,
        docId,
      });
    } catch (error) {}
  }
);

exports.onState4 = onDocumentWritten(
  "/INDONESIA/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/DATA/{status}",
  async (event) => {
    try {
      const [afterData, beforeData] = [
        event.data.after.data(),
        event.data.before.data(),
      ];

      const { state1, state2, state3, status } = event.params;

      var docId = `INDONESIA/${state1}/CHILDS/${state2}/CHILDS/${state3}/DATA/${status}`;
      var data = await db.doc(docId).get();

      run({
        beforeData,
        afterData,
        data,
        docId,
      });
    } catch (error) {}
  }
);

exports.onState3 = onDocumentWritten(
  "/INDONESIA/{state1}/CHILDS/{state2}/CHILDS/{state3}/DATA/{status}",
  async (event) => {
    try {
      const [afterData, beforeData] = [
        event.data.after.data(),
        event.data.before.data(),
      ];

      const { state1, state2, status } = event.params;

      var docId = `INDONESIA/${state1}/CHILDS/${state2}/DATA/${status}`;
      var data = await db.doc(docId).get();

      run({
        beforeData,
        afterData,
        data,
        docId,
      });
    } catch (error) {}
  }
);

exports.onState2 = onDocumentWritten(
  "/INDONESIA/{state1}/CHILDS/{state2}/DATA/{status}",
  async (event) => {
    try {
      const [afterData, beforeData] = [
        event.data.after.data(),
        event.data.before.data(),
      ];

      const { state1, status } = event.params;

      var docId = `INDONESIA/${state1}/DATA/${status}`;
      var data = await db.doc(docId).get();

      run({
        beforeData,
        afterData,
        data,
        docId,
      });
    } catch (error) {}
  }
);

exports.onState1 = onDocumentWritten(
  "/INDONESIA/{state1}/DATA/{status}",
  async (event) => {
    try {
      const [afterData, beforeData] = [
        event.data.after.data(),
        event.data.before.data(),
      ];

      const { status } = event.params;

      var docId = `INDONESIA/${status}`;
      var data = await db.doc(docId).get();

      run({
        beforeData,
        afterData,
        data,
        docId,
      });
    } catch (error) {}
  }
);

exports.onTPSCount = onDocumentWritten(
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
        const { valid } = afterData;

        var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;
        var doc = await db.doc(docId).get();

        if (doc.exists)
          return await db.doc(docId).update(
            {
              valid: (doc.data()?.valid || 0) + valid ? 1 : 0,
              invalid: (doc.data()?.invalid || 0) + valid ? 0 : 1,
            },
            { merge: true }
          );
      }

      // Delete
      if (afterData == undefined) {
        const { valid } = beforeData;

        var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;

        var doc = await db.doc(docId).get();

        if (doc.exists)
          return await db.doc(docId).update(
            {
              valid: (doc.data()?.valid || 0) + (valid ? -1 : 0),
              invalid: (doc.data()?.invalid || 0) + (valid ? 0 : -1),
            },
            { merge: true }
          );
      }

      //   Update

      const { valid: beforeValid } = beforeData;
      const { valid: afterValid } = afterData;

      var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}/CHILDS/${state5}`;

      if (afterValid == beforeValid) {
        return;
      }

      var doc = await db.doc(docId).get();

      if (doc.exists)
        await db.doc(docId).update(
          {
            valid: (doc.data()?.valid || 0) + (afterValid ? 1 : -1),
            invalid: (doc.data()?.invalid || 0) + (afterValid ? -1 : 1),
          },
          { merge: true }
        );
    } catch (error) {
      console.log(error);
    }
  }
);

exports.onTPSCount5 = onDocumentWritten(
  "/STATE/{state1}/CHILDS/{state2}/CHILDS/{state3}/CHILDS/{state4}/CHILDS/{state5}",
  async (event) => {
    try {
      const [afterData, beforeData] = [
        event.data.after.data(),
        event.data.before.data(),
      ];

      const { state1, state2, state3, state4 } = event.params;

      if (beforeData == undefined) return;

      var docId = `STATE/${state1}/CHILDS/${state2}/CHILDS/${state3}/CHILDS/${state4}`;

      console.log(`${docId}/CHILDS`);
      const coll = db.collection(`${docId}/CHILDS`);
      const snapshot = await getAggregateFromServer(coll, {
        invalid: sum("invalid"),
        valid: sum("valid"),
      });

      console.log(snapshot.data());

      //   console.log("totalPopulation: ", snapshot.data());
    } catch (error) {
      console.log(error);
    }
  }
);
