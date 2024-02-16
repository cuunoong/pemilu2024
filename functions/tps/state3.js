const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { runCount } = require("./utils");

const path =
  "/TPS/INDONESIA/CHILDREN/{state1}/CHILDREN/{state2}/CHILDREN/{state3}";

const onTpsTk3Written = onDocumentWritten(path, async (event) => {
  const { state1, state2 } = event.params;

  var docId = `TPS/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}`;

  await runCount({ docId });
});

module.exports = {
  onTpsTk3Written,
};
