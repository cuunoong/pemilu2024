const db = require("../db");

const runCount = async ({ docId }) => {
  try {
    var doc = await db
      .collection(docId + "/CHILDREN")
      .select("REAL", "KPU")
      .get();

    var data = {
      REAL: {
        anies: 0,
        prabowo: 0,
        ganjar: 0,
      },
      KPU: { anies: 0, prabowo: 0, ganjar: 0 },
    };

    var docs = doc.docs;
    while (docs.length) {
      var currentDoc = docs.shift().data();
      if (currentDoc) {
        data.REAL.anies += currentDoc?.REAL?.anies || 0;
        data.REAL.prabowo += currentDoc?.REAL?.prabowo || 0;
        data.REAL.ganjar += currentDoc?.REAL?.ganjar || 0;

        data.KPU.anies += currentDoc?.KPU?.anies || 0;
        data.KPU.prabowo += currentDoc?.KPU?.prabowo || 0;
        data.KPU.ganjar += currentDoc?.KPU?.ganjar || 0;
      }
    }

    await db.doc(docId).update(data, { merge: true });
  } catch (error) {}
};

module.exports = { runCount };
