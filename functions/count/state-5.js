const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { runCount } = require("./utils");

const path =
  "COUNT/INDONESIA/CHILDREN/{state1}/CHILDREN/{state2}/CHILDREN/{state3}/CHILDREN/{state4}/CHILDREN/{state5}";

const onState5CountWritten = onDocumentWritten(path, async (event) => {
  const { state1, state2, state3, state4 } = event.params;

  var docId = `COUNT/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}`;

  await runCount({ docId });
});

module.exports = {
  onState5CountWritten,
};
