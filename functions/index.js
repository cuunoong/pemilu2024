const {
  onTPSCheckCreated,
  onTPSCheckDeleted,
  onTPSCheckUpdated,
  onTpsTk5Written,
  onTpsTk4Written,
  onTpsTk3Written,
  onTpsTk2Written,
  onTpsTk1Written,
} = require("./tps");

const {
  onTpsDataCountCreated,
  onTpsDataCountDeleted,
  onTpsDataCountUpdated,
  onState5CountWritten,
  onState4CountWritten,
  onState3CountWritten,
  onState2CountWritten,
  onState1CountWritten,
} = require("./count");

module.exports = {
  //TPS
  onTPSCheckCreated,
  onTPSCheckDeleted,
  onTPSCheckUpdated,
  onTpsTk5Written,
  onTpsTk4Written,
  onTpsTk3Written,
  onTpsTk2Written,
  onTpsTk1Written,

  // COUNT
  onTpsDataCountCreated,
  onTpsDataCountDeleted,
  onTpsDataCountUpdated,
  onState5CountWritten,
  onState4CountWritten,
  onState3CountWritten,
  onState2CountWritten,
  onState1CountWritten,
};
