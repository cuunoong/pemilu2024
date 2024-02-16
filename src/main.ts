import axios from "axios";
import { StateModel } from "./models/state.model";
import { TPSModel } from "./models/tps.model";
import axiosRetry from "axios-retry";
import state from "./db/state";
import { ChartModel } from "./models/chart.model";
import db from "./db";

axiosRetry(axios, {
  retries: 10,
  retryCondition(error) {
    return true;
  },
});

var count = 0;

const BASE_URL = "https://sirekap-obj-data.kpu.go.id";

var KPUChartFinal = new ChartModel();
var validChartFinal = new ChartModel();

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
  var ret = true;

  var fetchData: StateModel[] = [];

  fetchData = await getDataTK({ code });

  while (fetchData.length) {
    var currentData = fetchData.shift();

    if (!currentData) return;

    if (currentData.tingkat != 5) {
      const nextCode =
        code === "0" ? currentData.kode : `${code}/${currentData.kode}`;

      await state.setValue({
        path: nextCode,
        value: currentData,
      });

      console.log(`\t ${nextCode}`);

      await getDataAllTK(nextCode);
    }

    if (currentData.tingkat == 5) {
      const currentCode = `${code}/${currentData.kode}`;
      // var dataTPS = await state.getTps(currentCode);
      // var dataValue = await state.getValue(currentCode);

      var dataTPS = await getDataTps({ code: currentCode });
      dataTPS.validate();

      var dataValue = currentData;

      await state.setValue({
        path: currentCode,
        value: dataValue,
      });

      await state.setTps({
        path: code + "/" + currentData.kode,
        value: dataTPS,
      });

      ret = ret && (dataTPS.valid || false);

      return;

      // count++;

      // console.log(`${count}.\t Loading ${dataValue?.nama}`);

      // KPUChart.anis += dataTPS.chart?.[100025] || 0;
      // KPUChart.prabowo += dataTPS.chart?.[100026] || 0;
      // KPUChart.ganjar += dataTPS.chart?.[100027] || 0;

      // if (dataTPS.valid) {
      //   validChart.anis += dataTPS.chart?.[100025] || 0;
      //   validChart.prabowo += dataTPS.chart?.[100026] || 0;
      //   validChart.ganjar += dataTPS.chart?.[100027] || 0;
      // }

      // KPUChartFinal.anis += dataTPS.chart?.[100025] || 0;
      // KPUChartFinal.prabowo += dataTPS.chart?.[100026] || 0;
      // KPUChartFinal.ganjar += dataTPS.chart?.[100027] || 0;

      // if (dataTPS.valid) {
      //   validChartFinal.anis += dataTPS.chart?.[100025] || 0;
      //   validChartFinal.prabowo += dataTPS.chart?.[100026] || 0;
      //   validChartFinal.ganjar += dataTPS.chart?.[100027] || 0;
      // }

      // state.setChart({
      //   path: "ALL",
      //   value: {
      //     kpu: KPUChartFinal,
      //     valid: validChartFinal,
      //   },
      // });

      // if (Object.keys(childs).indexOf(currentData.kode) == -1) {
      //   childs[currentData.kode] = !dataTPS.valid!;
      // }
    }
  }
};

var main = async () => {
  // await state.reset();
  var data = await getDataAllTK("11/1105/110506");

  // while (data) {
  //   count = 0;
  //   data = await getDataAllTK();
  // }

  console.log("FINISHED");
};

main();
