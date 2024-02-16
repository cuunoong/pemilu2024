const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { runCount } = require("./utils");

const path = "COUNT/INDONESIA/CHILDREN/{state1}/CHILDREN/{state2}";

const onState2CountWritten = onDocumentWritten(path, async (event) => {
  const { state1 } = event.params;

  var docId = `COUNT/INDONESIA/CHILDREN/${state1}`;

  await runCount({ docId });
});

module.exports = {
  onState2CountWritten,
};
