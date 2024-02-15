import { TPSModel } from "./tps.model";

export class StateModel {
  nama: string;
  id: number;
  kode: string;
  tingkat: number;
  childs?: StateModel[];
  tps?: TPSModel;
}
