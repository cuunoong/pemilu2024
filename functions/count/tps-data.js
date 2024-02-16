const {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const db = require("../db");
var _ = require("lodash");

const path =
  "/TPS/INDONESIA/CHILDREN/{state1}/CHILDREN/{state2}/CHILDREN/{state3}/CHILDREN/{state4}/CHILDREN/{state5}/CHILDREN/TPS";

const status = (valid) => (valid ? "REAL" : "KPU");

const updateData = async ({
  status,
  anies,
  prabowo,
  ganjar,
  docId,
  exists,
}) => {
  if (exists)
    return await db.doc(docId).update(
      {
        [status]: {
          anies,
          prabowo,
          ganjar,
        },
      },
      { merge: true }
    );
  return await db.doc(docId).set({
    [status]: {
      anies,
      prabowo,
      ganjar,
    },
  });
};

const onTpsDataCountCreated = onDocumentCreated(path, async (event) => {
  const { state1, state2, state3, state4, state5 } = event.params;

  const docId = `COUNT/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}/CHILDREN/${state5}`;

  const { valid, chart } = event.data.data();

  const data = await db.doc(docId).get();

  const anies =
    (!chart ? 0 : chart[100025] || 0) +
    (data.data()?.[status(valid)]?.anies || 0);
  const prabowo =
    (!chart ? 0 : chart[100026] || 0) +
    (data.data()?.[status(valid)]?.prabowo || 0);
  const ganjar =
    (!chart ? 0 : chart[100027] || 0) +
    (data.data()?.[status(valid)]?.ganjar || 0);

  await updateData({
    exists: data.exists,
    docId,
    status: status(valid),
    anies,
    prabowo,
    ganjar,
  });
});

const onTpsDataCountDeleted = onDocumentDeleted(path, async (event) => {
  const { state1, state2, state3, state4, state5 } = event.params;

  var docId = `COUNT/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}/CHILDREN/${state5}`;

  const { valid, chart } = event.data.data();

  var data = await db.doc(docId).get();

  const anies =
    (data.data()?.[status(valid)]?.anies || 0) -
    (!chart ? 0 : chart[100025] || 0);
  const prabowo =
    (data.data()?.[status(valid)]?.prabowo || 0) -
    (!chart ? 0 : chart[100026] || 0);
  const ganjar =
    (data.data()?.[status(valid)]?.ganjar || 0) -
    (!chart ? 0 : chart[100027] || 0);

  await updateData({
    exists: data.exists,
    docId,
    status: status(valid),
    anies,
    prabowo,
    ganjar,
  });
});

const onTpsDataCountUpdated = onDocumentUpdated(path, async (event) => {
  const { state1, state2, state3, state4, state5 } = event.params;

  var docId = `COUNT/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}/CHILDREN/${state5}`;

  const { valid: afterValid, chart: afterChart } = event.data.after.data();
  const { valid: beforeValid, chart: beforeChart } = event.data.before.data();

  if (_.isEqual(afterChart, beforeChart) && afterValid == beforeValid) return;

  var data = await db.doc(docId).get();

  if (afterValid == beforeValid) {
    const anies =
      (data.data()?.[status(afterValid)]?.anies || 0) -
      (!beforeChart ? 0 : beforeChart[100025] || 0) +
      (!afterChart ? 0 : afterChart[100025] || 0);
    const prabowo =
      (data.data()?.[status(afterValid)]?.prabowo || 0) -
      (!beforeChart ? 0 : beforeChart[100026] || 0) +
      (!afterChart ? 0 : afterChart[100026] || 0);
    const ganjar =
      (data.data()?.[status(afterValid)]?.ganjar || 0) -
      (!beforeChart ? 0 : beforeChart[100027] || 0) +
      (!afterChart ? 0 : afterChart[100027] || 0);

    await updateData({
      exists: data.exists,
      docId,
      status: status(afterValid),
      anies,
      prabowo,
      ganjar,
    });

    return;
  }

  const beforeAnies =
    (data.data()?.[status(beforeValid)]?.anies || 0) -
    (!beforeChart ? 0 : beforeChart[100025] || 0);
  const beforePrabowo =
    (data.data()?.[status(beforeValid)]?.prabowo || 0) -
    (!beforeChart ? 0 : beforeChart[100026] || 0);
  const beforeGanjar =
    (data.data()?.[status(beforeValid)]?.ganjar || 0) -
    (!beforeChart ? 0 : beforeChart[100027] || 0);

  await updateData({
    exists: data.exists,
    docId,
    status: status(beforeValid),
    anies: beforeAnies,
    prabowo: beforePrabowo,
    ganjar: beforeGanjar,
  });

  const afterAnies =
    (data.data()?.[status(afterValid)]?.anies || 0) +
    (!afterChart ? 0 : afterChart[100025] || 0);
  const afterPrabowo =
    (data.data()?.[status(afterValid)]?.prabowo || 0) +
    (!afterChart ? 0 : afterChart[100026] || 0);
  const afterGanjar =
    (data.data()?.[status(afterValid)]?.ganjar || 0) +
    (!afterChart ? 0 : afterChart[100027] || 0);

  await updateData({
    exists: data.exists,
    docId,
    status: status(afterValid),
    anies: afterAnies,
    prabowo: afterPrabowo,
    ganjar: afterGanjar,
  });
});

module.exports = {
  onTpsDataCountCreated,
  onTpsDataCountDeleted,
  onTpsDataCountUpdated,
};
