import Button from './Button';
import { MenuTitle } from '../constants';

interface MenuTitleItem {
  iconName: string;
  title: string;
}

export default class Navigation {
  constructor() {}

  private createCloseIcon() {
    const closeMenu = () => {
      console.log('menu');
    };

    const iconWrap = document.createElement('div');
    iconWrap.className = 'nav__icon-wrap';
    const svg = document.createElement('img');
    svg.className = 'nav__img';
    svg.src = 'src/assets/images/close.svg';
    iconWrap.append(svg);

    iconWrap.addEventListener('click', () => closeMenu());

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
    btn.className = 'nav__logout button';

    return btn;
  }

  render() {
    const component = document.createElement('nav');
    component.className = 'nav';
    const menu = document.createElement('ul');
    menu.className = 'menu';

    MenuTitle.forEach((item, i) => {
      menu.append(this.createLink(item));
    });

    component.append(this.createCloseIcon(), menu, this.createLogoutBtn());

    return component;
  }
}
