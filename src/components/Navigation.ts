/* eslint-disable no-param-reassign */
import { MenuTitle } from '../constants';

export default class Navigation {
  constructor() {}

  isLinkActive(el: HTMLElement) {
    const links = document.querySelectorAll('.menu__item');
    links.forEach((element) => {
      (element as HTMLElement).style.background = 'none';
    });
    el.style.backgroundColor = '#ffffff30';
  }

  render() {
    const component = document.createElement('ul');
    component.className = 'menu';

    MenuTitle.forEach((item, i) => {
      const link = document.createElement('li');
      link.className = 'menu__item';
      if (i === 0) {
        link.style.backgroundColor = '#ffffff30';
      }

      const iconWrap = document.createElement('div');
      iconWrap.className = 'menu__icon-wrap';
      const svg = document.createElement('img');
      svg.src = `src/assets/images/${item.iconName}`;
      iconWrap.append(svg);

      const linkName = document.createElement('a');
      linkName.className = 'menu__link';
      const linkText = document.createElement('span');
      linkText.textContent = item.title;
      linkName.href = `#${item.title.toLowerCase()}`;

      linkName.append(iconWrap, linkText);
      link.append(linkName);
      component.append(link);

      linkName.addEventListener('click', () => this.isLinkActive(link));
    });

    return component;
  }
}
