const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { runCount } = require("./utils");

const path = "/TPS/INDONESIA/CHILDREN/{state1}";

const onTpsTk1Written = onDocumentWritten(path, async (event) => {
  var docId = `TPS/INDONESIA`;

  await runCount({ docId });
});

module.exports = {
  onTpsTk1Written,
};
