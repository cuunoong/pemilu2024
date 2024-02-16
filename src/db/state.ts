import { doc, setDoc } from "firebase/firestore";
import db from ".";
import { StateModel } from "../models/state.model";
import { TPSModel } from "../models/tps.model";
import { ChartModel } from "../models/chart.model";

class State {
  static instance = null;

  static getInstance = () => {
    return this.instance ?? new State();
  };

  getPath = (path = "") => {
    var paths = path.replace(/\//g, "/CHILDS/").split("/");

    return doc(db, "STATE", ...paths);
  };

  getAll = async () => {
    // var snapshot = await get(this.getPath());
    // if (snapshot.exists()) return snapshot.val() as StateModel;
    // return null;
  };

  reset = async () => {
    // return remove(this.getPath());
  };

  setValue = async (props: { path: string; value: StateModel }) => {
    return await setDoc(this.getPath(props.path), props.value);
  };

  setTps = async (props: { path: string; value: TPSModel }) => {
    return await setDoc(this.getPath(props.path + "/TPS"), props.value.toDoc());
  };

  getValue = async (path: string = "") => {
    // var snapshot = await get(this.getPath(path + "/value"));
    // if (snapshot.exists()) return snapshot.val() as StateModel;
    // return null;
  };

  setChilds = async (props: { path: string; value: any }) => {
    // return update(this.getPath(props.path + "/value/childs"), props.value);
  };

  getChilds = async (path: string = "") => {
    // var snapshot = await get(this.getPath(path + "/value/childs"));
    // if (snapshot.exists()) return snapshot.val() as { [key: string]: boolean };
    // return null;
  };

  setChart = async (props: { path: string; value: any }) => {
    // return update(this.getPath(props.path + "/value/charts"), props.value);
  };

  getChart = async (path: string = "") => {
    // var snapshot = await get(this.getPath(path + "/value/charts"));
    // if (snapshot.exists())
    //   return snapshot.val() as { kpu: ChartModel; valid: ChartModel };
    // return null;
  };

  getTps = async (path: string = "") => {
    // var snapshot = await get(this.getPath(path + "/tps"));
    // if (snapshot.exists()) {
    //   var data = snapshot.val() as TPSModel;
    //   var newData = new TPSModel();
    //   return newData.fill(data);
    // }
    // return null;
  };
}

export default State.getInstance();
