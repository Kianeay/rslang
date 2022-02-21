export default class Pagination {
  private pages = 30;

  private visiblePages = 3;

  private callback: (page: string) => void;

  private startPage = 0;

  constructor(callback: (page: string) => void) {
    this.callback = callback;
  }

  private createPrevButton() {
    const component = document.createElement('div');
    component.className = 'pagination__control';
    component.classList.add('pagination__control-prev');
    component.textContent = '<';

    return component;
  }

  private createNextButton() {
    const component = document.createElement('div');
    component.className = 'pagination__control';
    component.classList.add('pagination__control-next');
    component.textContent = '>';

    return component;
  }

  private createMiddleButton() {
    const component = document.createElement('div');
    component.className = 'pagination__control';
    component.classList.add('pagination__control-middle');
    component.textContent = '...';

    return component;
  }

  private createPaginationItems(component: HTMLElement) {
    let page = Number(localStorage.getItem('textbook-page'));
    if (typeof page !== 'number') {
      page = 0;
    }

    for (let i = 0; i < this.pages; i += 1) {
      if (i === this.visiblePages) {
        component.append(this.createMiddleButton());
      }

      const item = document.createElement('div');
      item.className = 'pagination__item';
      item.setAttribute('data-num', String(i));
      if (i < this.visiblePages || i >= this.pages - this.visiblePages) {
        item.classList.add('pagination__item-visible');
      }

      item.textContent = String(i + 1);

      if (i === page) {
        item.classList.add('pagination__item-active');
      }

      component.append(item);
    }
  }

  private changeActivePage(element: HTMLElement) {
    const parent = element.parentElement;

    Array.from(parent.children).forEach((child) => {
      child.classList.remove('pagination__item-active');
    });

    element.classList.add('pagination__item-active');
  }

  refreshActivePage(page: string) {
    const pages = document.querySelectorAll('.pagination__item');

    Array.from(pages).forEach((child, index) => {
      child.classList.remove('pagination__item-active');

      if (String(index) === page) {
        child.classList.add('pagination__item-active');
      }
    });
  }

  render() {
    const component = document.createElement('div');
    component.className = 'pagination';

    component.append(this.createPrevButton());
    this.createPaginationItems(component);
    component.append(this.createNextButton());

    component.addEventListener('click', (event: Event) => {
      const { target } = event;

      if ((target as HTMLElement).classList.contains('pagination__item')) {
        this.changeActivePage(target as HTMLElement);
        const currentLevel = (target as HTMLElement).dataset.num;

        this.callback(currentLevel);
      }
    });

    return component;
  }
}
