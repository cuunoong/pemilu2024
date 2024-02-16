const {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const db = require("../db");
var _ = require("lodash");

const path =
  "/TPS/INDONESIA/CHILDREN/{state1}/CHILDREN/{state2}/CHILDREN/{state3}/CHILDREN/{state4}/CHILDREN/{state5}/CHILDREN/TPS";

const updateData = async ({ valid, invalid, docId, exists }) => {
  if (exists)
    return await db.doc(docId).update(
      {
        valid,
        invalid,
      },
      { merge: true }
    );
  return await db.doc(docId).set({
    valid,
    invalid,
  });
};

const onTPSCheckCreated = onDocumentCreated(path, async (event) => {
  const { state1, state2, state3, state4, state5 } = event.params;

  var docId = `TPS/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}/CHILDREN/${state5}`;

  var doc = await db.doc(docId).get();

  const { valid: tpsValid } = event.data.data();

  const valid = (doc.data()?.valid || 0) + tpsValid ? 1 : 0;
  const invalid = (doc.data()?.invalid || 0) + tpsValid ? 0 : 1;

  await updateData({ valid, invalid, docId, exists: doc.exists });
});

const onTPSCheckDeleted = onDocumentDeleted(path, async (event) => {
  const { state1, state2, state3, state4, state5 } = event.params;

  var docId = `TPS/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}/CHILDREN/${state5}`;

  var doc = await db.doc(docId).get();

  const { valid: tpsValid } = event.data.data();

  const valid = (doc.data()?.valid || 0) + (tpsValid ? -1 : 0);
  const invalid = (doc.data()?.invalid || 0) + (tpsValid ? 0 : -1);

  await updateData({ valid, invalid, docId, exists: doc.exists });
});

const onTPSCheckUpdated = onDocumentUpdated(path, async (event) => {
  const { state1, state2, state3, state4, state5 } = event.params;

  var docId = `TPS/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}/CHILDREN/${state5}`;

  var doc = await db.doc(docId).get();

  const { valid: beforeValid } = event.data.before.data();
  const { valid: afterValid } = event.data.after.data();

  if (beforeValid == afterValid) return;

  const valid = (doc.data()?.valid || 0) + (afterValid ? 1 : -1);
  const invalid = (doc.data()?.invalid || 0) + (afterValid ? -1 : 1);

  await updateData({ valid, invalid, docId, exists: doc.exists });
});

module.exports = {
  onTPSCheckCreated,
  onTPSCheckDeleted,
  onTPSCheckUpdated,
};
