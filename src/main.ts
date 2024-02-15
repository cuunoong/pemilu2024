import fs, { mkdir } from "fs";
import axios from "axios";
import { StateModel } from "./models/state.model";
import { TPSModel } from "./models/tps.model";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 10,
});

var count = 0;

const BASE_URL = "https://sirekap-obj-data.kpu.go.id";

var saveToFile = ({
  data,
  dir,
  name,
}: {
  data: any;
  dir: string;
  name: string;
}) => {
  if (!fs.existsSync("dist/" + dir)) {
    fs.mkdirSync("dist/" + dir, { recursive: true });
  }

  let dataJson = JSON.stringify(data);

  fs.writeFile(
    "dist/" + (dir === "" ? name : dir + "/" + name) + ".json",
    dataJson,
    (err) => {
      if (err) {
        console.log("Error writing file:", err);
      } else {
      }
    }
  );
};

var getDataTps = async (props: { code: string }): Promise<TPSModel> => {
  var { data } = await axios.get(
    `${BASE_URL}/pemilu/hhcw/ppwp/${props.code}.json`
  );

  return data as TPSModel;
};

var getDataTK = async (props: { code: string }): Promise<StateModel[]> => {
  var { data: state } = await axios.get(
    `${BASE_URL}/wilayah/pemilu/ppwp/${props.code}.json`
  );

  return state as StateModel[];
};

var getDataAllTK = async (code = "0"): Promise<StateModel[]> => {
  var data: StateModel[] = [];

  var fetchData = await getDataTK({ code });

  while (fetchData.length) {
    var current = fetchData.shift();

    if (!current) return data;

    if (current.tingkat != 5) {
      const nextCode = code === "0" ? current.kode : `${code}/${current.kode}`;

      saveToFile({
        data: current,
        dir: nextCode,
        name: "config",
      });

      console.log(`\t\t ${code}`);

      const getChildData = await getDataAllTK(nextCode);
      current.childs = getChildData;
      data.push(current);
    }

    if (current.tingkat == 5) {
      const dataTps = await getDataTps({ code: `${code}/${current.kode}` });

      current.tps = dataTps;
      data.push(current);

      count++;

      console.log(`${count}.\t Loading ${current.nama}`);

      saveToFile({
        data: current,
        dir: code + "/" + current.kode,
        name: "config",
      });
    }
  }

  return data;
};

var main = async () => {
  var data = await getDataAllTK();
};

main();
