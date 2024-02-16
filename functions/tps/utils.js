const db = require("../db");

const runCount = async ({ docId }) => {
  try {
    var doc = await db
      .collection(docId + "/CHILDREN")
      .select("invalid", "valid")
      .get();

    var valid = 0,
      invalid = 0,
      ids = [];

    var docs = doc.docs;
    while (docs.length) {
      var currentDoc = docs.shift();
      if (currentDoc) {
        valid += currentDoc.data()?.valid || 0;
        invalid += currentDoc.data()?.invalid || 0;

        if ((currentDoc.data()?.invalid || 0) > 0) ids.push(currentDoc.id);
      }
    }

    await db.doc(docId).update({ valid, invalid, ids }, { merge: true });
  } catch (error) {}
};

module.exports = { runCount };
