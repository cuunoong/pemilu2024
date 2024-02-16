const {
  onTpsDataCountCreated,
  onTpsDataCountDeleted,
  onTpsDataCountUpdated,
} = require("./tps-data");

const { onState5CountWritten } = require("./state-5");
const { onState4CountWritten } = require("./state-4");
const { onState3CountWritten } = require("./state-3");
const { onState2CountWritten } = require("./state-2");
const { onState1CountWritten } = require("./state-1");

module.exports = {
  // On TPS Data
  onTpsDataCountCreated,
  onTpsDataCountDeleted,
  onTpsDataCountUpdated,

  // On State 5
  onState5CountWritten,
  onState4CountWritten,
  onState3CountWritten,
  onState2CountWritten,
  onState1CountWritten,
};
