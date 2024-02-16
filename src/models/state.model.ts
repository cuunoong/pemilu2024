import { ChartModel } from "./chart.model";

export class StateModel {
  id: number;
  nama: string;
  kode: string;
  tingkat: number;

  valid: number;
  invalid: number;

  fetched: boolean;
  ids?: string[];
}
