import { ChartModel } from "./chart.model";

export class StateModel {
  nama: string;
  id: number;
  kode: string;
  tingkat: number;
  childs?: { [code: string]: boolean };
  charts: {
    valid: ChartModel;
    kpu: ChartModel;
  };
}
