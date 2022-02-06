import { MenuTitle } from '../constants';

interface MenuTitleItem {
  iconName: string;
  title: string;
}

export default class Navigation {
  constructor() {}

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

  render() {
    const component = document.createElement('ul');
    component.className = 'menu';

    MenuTitle.forEach((item, i) => {
      component.append(this.createLink(item));
    });

    return component;
  }
}
