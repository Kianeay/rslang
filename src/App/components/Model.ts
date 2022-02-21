/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty-function */
import Controller from './Controller';

export interface IStore {
  [key: string]: any;
}

export default class Model {
  private store: IStore = {
    // default state
  };

  constructor(private controller: Controller) {}

  getStore = () => this.store;

  setStore = (newState: any) => {
    for (const key in newState) {
      this.store = { ...this.store, [key]: newState[key] };
    }
  };
}
