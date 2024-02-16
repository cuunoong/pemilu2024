const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { runCount } = require("./utils");

const path = "/TPS/INDONESIA/CHILDREN/{state1}/CHILDREN/{state2}";

const onTpsTk2Written = onDocumentWritten(path, async (event) => {
  const { state1 } = event.params;

  var docId = `TPS/INDONESIA/CHILDREN/${state1}`;

  await runCount({ docId });
});

module.exports = {
  onTpsTk2Written,
};
