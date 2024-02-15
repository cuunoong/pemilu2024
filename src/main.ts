import axios from "axios";
import { StateModel } from "./models/state.model";
import { TPSModel } from "./models/tps.model";
import axiosRetry from "axios-retry";
import state from "./db/state";
import { ChartModel } from "./models/chart.model";

axiosRetry(axios, {
  retries: 10,
});

var count = 0;

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
  var ret = true;
  var childs: { [k: string]: boolean } = {};
  var fetchData = await getDataTK({ code });

  var KPUChart = new ChartModel();
  var validChart = new ChartModel();

  while (fetchData.length) {
    var current = fetchData.shift();

    if (!current) return;

    if (current.tingkat != 5) {
      const nextCode = code === "0" ? current.kode : `${code}/${current.kode}`;

      await state.setValue({
        path: nextCode,
        value: current,
      });

      console.log(`\t\t ${nextCode}`);

      const chart = await getDataAllTK(nextCode);

      validChart.anis += chart?.valid.anis || 0;
      validChart.prabowo += chart?.valid.prabowo || 0;
      validChart.ganjar += chart?.valid.ganjar || 0;

      KPUChart.anis += chart?.kpu.anis || 0;
      KPUChart.prabowo += chart?.kpu.prabowo || 0;
      KPUChart.ganjar += chart?.kpu.ganjar || 0;

      if (Object.keys(childs).indexOf(current.kode) == -1) {
        childs[current.kode] = chart?.invalid!;
      }
    }

    if (current.tingkat == 5) {
      const currentCode = `${code}/${current.kode}`;
      var dataTPS = await state.getTps(currentCode);
      var dataValue = await state.getValue(currentCode);

      if (!dataTPS || !dataValue || !dataTPS.valid || !dataTPS.fetched) {
        dataTPS = await getDataTps({ code: currentCode });
        dataTPS.validate();

        dataValue = current;

        await state.setValue({
          path: currentCode,
          value: current,
        });

        await state.setTps({
          path: code + "/" + current.kode,
          value: dataTPS,
        });

        console.log("FETCH");
      }

      count++;

      console.log(`${count}.\t Loading ${dataValue?.nama}`);

      ret = ret && (dataTPS.valid || false);

      KPUChart.anis += dataTPS.chart?.[100025] || 0;
      KPUChart.prabowo += dataTPS.chart?.[100026] || 0;
      KPUChart.ganjar += dataTPS.chart?.[100027] || 0;

      if (dataTPS.valid) {
        validChart.anis += dataTPS.chart?.[100025] || 0;
        validChart.prabowo += dataTPS.chart?.[100026] || 0;
        validChart.ganjar += dataTPS.chart?.[100027] || 0;
      }

      if (Object.keys(childs).indexOf(current.kode) == -1) {
        childs[current.kode] = !dataTPS.valid!;
      }
    }
  }

  console.log(childs);

  await state.setChilds({ path: code, value: childs });

  await state.setChart({
    path: code,
    value: { valid: validChart, kpu: KPUChart },
  });

  return {
    kpu: KPUChart,
    valid: validChart,
    invalid: !ret,
  };
};

var main = async () => {
  await getDataAllTK("11/1105");
};

main();
