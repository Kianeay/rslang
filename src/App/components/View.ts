import Controller from './Controller';
import { MainPage, TextbookPage, GamesPage } from '../../pages';
import { Navigation } from '../../components';

export default class View {
  private appPage: Element | null = null;

  private nav: Element | null = null;

  private content: Element | null = null;

  constructor(private controller: Controller, private root: Element) {
    this.createRoot(root);
  }

  changePage(page: string) {
    switch (page.slice(1)) {
      case 'main':
        this.appPage = new MainPage().render();
        break;

      case 'textbook':
        this.appPage = new TextbookPage().render();
        break;

      case 'minigames':
        this.appPage = new GamesPage().render();
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

    this.content.innerHTML = '';
    this.content.append(this.appPage);

    this.updateLink(page);
  }

  createRoot(root: Element) {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const nav = new Navigation().render();
    this.nav = nav;

    const content = document.createElement('div');
    content.className = 'content';
    this.content = content;

    wrapper.append(nav, content);

    root.append(wrapper);
  }

  updateLink(currentPage: string) {
    const links = document.querySelectorAll('.menu__link');
    links.forEach((el) => {
      if (currentPage === el.getAttribute('href')) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    /*   for (const link of links) {
      currentPage === link.getAttribute('href').slice(1)
        ? link.classList.add('active')
        : link.classList.remove('active');
    } */
  }
}
