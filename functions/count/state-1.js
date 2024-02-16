const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { runCount } = require("./utils");

const path = "COUNT/INDONESIA/CHILDREN/{state1}";

const onState1CountWritten = onDocumentWritten(path, async (event) => {
  const { state1 } = event.params;

  var docId = `COUNT/INDONESIA`;

  await runCount({ docId });
});

module.exports = {
  onState1CountWritten,
};
