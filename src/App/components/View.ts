import Controller from './Controller';
import { MainPage } from '../../pages';

export default class View {
  private appPage: Element | null = null;

  constructor(private controller: Controller, private root: Element) {}

  changePage(page: string) {
    switch (page.slice(1)) {
      case 'main':
        this.appPage = new MainPage().render();
        break;

      case 'textbook':
        //  this.appPage = comp;

        break;

      case 'games':
        //  this.appPage = ;
        break;

      case 'statistics':
        //  this.appPage = ;
        break;

      case 'login':
        //  this.appPage = ;
        break;

      default:
        break;
    }
    this.root.innerHTML = '';
    this.root.append(this.appPage);
  }
}
