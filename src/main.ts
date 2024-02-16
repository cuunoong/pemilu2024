import axios from "axios";
import { StateModel } from "./models/state.model";
import { TPSModel } from "./models/tps.model";
import axiosRetry from "axios-retry";
import state from "./db/state";

var index = 0;

axiosRetry(axios, {
  retries: 10,
  retryCondition(error) {
    return true;
  },
});

const BASE_URL = "https://sirekap-obj-data.kpu.go.id";

var getDataTps = async (props: { code: string }): Promise<TPSModel> => {
  var { data } = await axios.get(
    `${BASE_URL}/pemilu/hhcw/ppwp/${props.code}.json`
  );

  return new TPSModel().fill(data);
};

var getDataTK = async (props: { code: string }): Promise<StateModel[]> => {
  var { data: state } = await axios.get(
    `${BASE_URL}/wilayah/pemilu/ppwp/${props.code}.json`
  );

  return state as StateModel[];
};

var getDataAllTK = async (code = "0") => {
  var fetchData: StateModel[] = [];

  fetchData = await getDataTK({ code });

  while (fetchData.length) {
    var currentData = fetchData.shift();

    if (!currentData) return;

    if (currentData.tingkat != 5) {
      const nextCode =
        code === "0" ? currentData.kode : `${code}/${currentData.kode}`;

      console.log(`\t ${nextCode}`);

      await getDataAllTK(nextCode);

      await state.setValue({
        path: nextCode,
        value: {
          ...currentData,
          valid: currentData.valid || 0,
          invalid: currentData.invalid || 0,
          fetched: true,
        },
      });
    }

    if (currentData.tingkat == 5) {
      const currentCode = `${code}/${currentData.kode}`;

      var dataTPS = await getDataTps({ code: currentCode });
      dataTPS.validate();

      var dataValue = currentData;

      await state.setValue({
        path: currentCode,
        value: {
          ...dataValue,
          valid: dataValue.valid || 0,
          invalid: dataValue.invalid || 0,
          fetched: true,
        },
      });

      await state.setTps({
        path: code + "/" + currentData.kode,
        value: dataTPS,
      });

      index++;

      // return;
    }
  }
};

var main = async () => {
  var data = await getDataAllTK("11/1105/110507");

  console.log(`FINISHED ${index}`);
};

main();
