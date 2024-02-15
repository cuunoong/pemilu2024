import { child, get, ref, update } from "firebase/database";
import db from ".";
import { StateModel } from "../models/state.model";
import { TPSModel } from "../models/tps.model";

class State {
  static instance = null;

  static getInstance = () => {
    return this.instance ?? new State();
  };

  getPath = (path = "") => {
    return ref(db, "state/" + path);
  };

  getAll = async () => {
    var snapshot = await get(this.getPath());
    if (snapshot.exists()) return snapshot.val() as StateModel;
    return null;
  };

  setValue = async (props: { path: string; value: StateModel }) => {
    return update(this.getPath(props.path + "/value"), props.value);
  };

  setTps = async (props: { path: string; value: TPSModel }) => {
    return update(this.getPath(props.path + "/tps"), props.value);
  };

  getValue = async (path: string = "") => {
    var snapshot = await get(this.getPath(path + "/value"));
    if (snapshot.exists()) return snapshot.val() as StateModel;
    return null;
  };

  setChilds = async (props: { path: string; value: any }) => {
    return update(this.getPath(props.path + "/value/childs"), props.value);
  };

  setChart = async (props: { path: string; value: any }) => {
    return update(this.getPath(props.path + "/value/charts"), props.value);
  };

  getTps = async (path: string = "") => {
    var snapshot = await get(this.getPath(path + "/tps"));

    if (snapshot.exists()) {
      var data = snapshot.val() as TPSModel;
      var newData = new TPSModel();
      return newData.fill(data);
    }
    return null;
  };
}

export default State.getInstance();
