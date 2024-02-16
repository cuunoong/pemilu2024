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

const validate = async ({
  code,
  currentData,
}: {
  code: string;
  currentData: StateModel;
}) => {
  var dataTPS = await getDataTps({ code });
  dataTPS.validate();

  var dataValue = currentData;

  await state.setValue({
    path: code,
    value: {
      ...dataValue,
      fetched: true,
    },
  });

  await state.setTps({
    path: code,
    value: dataTPS,
  });

  index++;

  console.log(`${index}.\t ${dataValue.nama}`);
};

var getDataAllTK = async (prop = "0") => {
  var fetchData: StateModel[] = [];

  const code = prop === "0" ? "" : prop;

  const dbData = await state.getValue({ path: code });

  if (dbData == null) {
    fetchData = await getDataTK({ code: prop });
  } else if (!dbData.fetched) {
    fetchData = await getDataTK({ code: prop });
  } else if (dbData.fetched) {
    if (dbData.tingkat == 5) {
      await validate({ code: prop, currentData: dbData });
      return;
    }

    var children = dbData.ids || [];

    while (children.length) {
      var nextId = children.shift();

      await getDataAllTK(`${code}/${nextId}`);
    }

    return;
  }

  while (fetchData.length) {
    var currentData = fetchData.shift();

    if (!currentData) return;

    if (currentData.tingkat != 5) {
      const nextCode =
        prop === "0" ? currentData.kode : `${code}/${currentData.kode}`;

      var tag = "#";
      while (tag.length < currentData.tingkat) tag += tag;

      console.log(`\n${tag} ${currentData.nama}`);

      await getDataAllTK(nextCode);

      await state.setValue({
        path: nextCode,
        value: {
          ...currentData,

          fetched: true,
        },
      });
    }

    if (currentData.tingkat == 5) {
      const currentCode = `${code}/${currentData.kode}`;
      await validate({ code: currentCode, currentData });
    }
  }
};

var main = async () => {
  const path = process.env.PATH_DATA || "";

  var iter = 1;

  do {
    console.log(`\n\n--------------\nITERASI KE-${iter++}\n--------------\n\n`);

    index = 0;
    await getDataAllTK(path);

    var invalid = (await state.getValue({ path }))?.invalid || 0;
  } while (invalid > 0);
};

main();
