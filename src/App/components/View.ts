import Controller from './Controller';
import { MainPage, TextbookPage } from '../../pages';

export default class View {
  private appPage: Element | null = null;

  constructor(private controller: Controller, private root: Element) {}

  changePage(page: string) {
    switch (page.slice(1)) {
      case 'main':
        this.appPage = new MainPage().render();
        break;

      case 'textbook':
        this.appPage = new TextbookPage().render();

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

    this.updateLink(page);
  }

  updateLink(currentPage: string) {
    console.log(currentPage);

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
