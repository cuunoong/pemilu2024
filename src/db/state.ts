import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import db from ".";
import { StateModel } from "../models/state.model";
import { TPSModel } from "../models/tps.model";

class State {
  static instance = null;

  static getInstance = () => {
    return this.instance ?? new State();
  };

  getPath = (path = "") => {
    var paths = path.replace(/\//g, "/CHILDREN/").split("/");

    return doc(db, "TPS/INDONESIA/CHILDREN", ...paths);
  };

  setValue = async (props: { path: string; value: StateModel }) => {
    if ((await this.getValue({ path: props.path })) == null)
      return await setDoc(this.getPath(props.path), props.value);
    return await updateDoc(this.getPath(props.path), { ...props.value });
  };

  setTps = async (props: { path: string; value: TPSModel }) => {
    return await setDoc(this.getPath(props.path + "/TPS"), props.value.toDoc());
  };

  getValue = async (props: { path: string }) => {
    return (await getDoc(this.getPath(props.path))).data() as StateModel;
  };
}

export default State.getInstance();
