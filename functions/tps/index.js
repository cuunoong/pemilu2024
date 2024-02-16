const {
  onTPSCheckCreated,
  onTPSCheckDeleted,
  onTPSCheckUpdated,
} = require("./check-valid");

const { onTpsTk5Written } = require("./state5");
const { onTpsTk4Written } = require("./state4");
const { onTpsTk3Written } = require("./state3");
const { onTpsTk2Written } = require("./state2");
const { onTpsTk1Written } = require("./state1");

module.exports = {
  onTPSCheckCreated,
  onTPSCheckDeleted,
  onTPSCheckUpdated,
  onTpsTk5Written,
  onTpsTk4Written,
  onTpsTk3Written,
  onTpsTk2Written,
  onTpsTk1Written,
};
