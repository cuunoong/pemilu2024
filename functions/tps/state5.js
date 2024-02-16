const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { runCount } = require("./utils");

const path =
  "/TPS/INDONESIA/CHILDREN/{state1}/CHILDREN/{state2}/CHILDREN/{state3}/CHILDREN/{state4}/CHILDREN/{state5}";

const onTpsTk5Written = onDocumentWritten(path, async (event) => {
  const { state1, state2, state3, state4 } = event.params;

  var docId = `TPS/INDONESIA/CHILDREN/${state1}/CHILDREN/${state2}/CHILDREN/${state3}/CHILDREN/${state4}`;

  await runCount({ docId });
});

module.exports = {
  onTpsTk5Written,
};
