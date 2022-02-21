import Button from './Button';
import { MenuTitle } from '../constants';

interface MenuTitleItem {
  iconName: string;
  title: string;
}

export default class Navigation {
  constructor() {}

  private closeMenu() {
    const closeMenu = document.querySelector('.nav__close-wrap');
    closeMenu.classList.add('none');
    const burgerMenu = document.querySelector('.nav__burger-wrap');
    burgerMenu.classList.remove('none');
    const menuText = document.querySelectorAll('.menu__text');
    menuText.forEach((el) => {
      el.classList.add('none');
    });
    const nav = document.querySelector('.nav');
    nav.classList.remove('open');
    const logoutIcon = document.querySelector('.nav__logout-wrap');
    logoutIcon.classList.remove('none');
    const logoutBtn = document.querySelector('.nav__logout');
    logoutBtn.classList.add('none');
  }

  private openMenu() {
    const closeMenu = document.querySelector('.nav__close-wrap');
    closeMenu.classList.remove('none');
    const burgerMenu = document.querySelector('.nav__burger-wrap');
    burgerMenu.classList.add('none');
    const menuText = document.querySelectorAll('.menu__text');
    menuText.forEach((el) => {
      el.classList.remove('none');
    });
    const nav = document.querySelector('.nav');
    nav.classList.add('open');
    const logoutIcon = document.querySelector('.nav__logout-wrap');
    logoutIcon.classList.add('none');
    const logoutBtn = document.querySelector('.nav__logout');
    logoutBtn.classList.remove('none');
  }

  private createCloseIcon() {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'nav__close-wrap none';
    const svg = document.createElement('img');
    svg.className = 'nav__close-img';
    svg.src = 'src/assets/images/close.svg';
    iconWrap.append(svg);

    iconWrap.addEventListener('click', () => this.closeMenu());

    return iconWrap;
  }

  private createBurgerIcon() {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'nav__burger-wrap';
    const svg = document.createElement('img');
    svg.className = 'nav__burger';
    svg.src = 'src/assets/images/menu.svg';
    iconWrap.append(svg);

    iconWrap.addEventListener('click', () => this.openMenu());

    return iconWrap;
  }

  private createIcon(iconName: string) {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'menu__icon-wrap';
    const svg = document.createElement('img');
    svg.className = 'menu__img';
    svg.src = `src/assets/images/${iconName}`;
    iconWrap.append(svg);

    return iconWrap;
  }

  private createLink({ iconName, title }: MenuTitleItem) {
    const link = document.createElement('li');
    link.className = 'menu__item';

    const linkName = document.createElement('a');
    linkName.className = 'menu__link';
    const linkText = document.createElement('span');
    linkText.className = 'menu__text none';
    linkText.textContent = title;
    linkName.href = `#${title.toLowerCase()}`;

    linkName.append(this.createIcon(iconName), linkText);
    link.append(linkName);

    return link;
  }

  private createLogoutBtn() {
    const logOut = () => {
      console.log('logout');
    };
    const btn = new Button({ label: 'Log out', onClick: logOut }).render();
    btn.className = 'nav__logout button none hidden';

    return btn;
  }

  private createLogoutIcon() {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'nav__logout-wrap hidden';
    const svg = document.createElement('img');
    svg.className = 'nav__logout-img';
    svg.src = 'src/assets/images/logout.svg';
    iconWrap.append(svg);

    iconWrap.addEventListener('click', () => console.log('logout'));

    return iconWrap;
  }

  render() {
    const component = document.createElement('nav');
    component.className = 'nav';
    const menu = document.createElement('ul');
    menu.className = 'menu';

    MenuTitle.forEach((item, i) => {
      menu.append(this.createLink(item));
    });

    component.append(
      this.createCloseIcon(),
      this.createBurgerIcon(),
      menu,
      this.createLogoutBtn(),
      this.createLogoutIcon(),
    );

    return component;
  }
}
