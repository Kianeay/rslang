import navigate from '../../Router';
import Model from './Model';
import View from './View';

export default class Controller {
  private model = new Model(this);

  private view = new View(this, this.root);

  constructor(private root: Element) {
    window.addEventListener('hashchange', () => this.changePage(location.hash));

    this.checkPage();
  }

  checkPage() {
    if (location.hash) {
      this.changePage(location.hash);
    } else {
      navigate('main');
    }
  }

  changePage(page: string) {
    this.view.changePage(page);
  }

  getStore() {
    return this.model.getStore();
  }

  setStore(state: any) {
    this.model.setStore(state);
  }
}
