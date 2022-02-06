/* eslint-disable no-param-reassign */
import { MenuTitle } from '../constants';

export default class Navigation {
  constructor() {}

  render() {
    const component = document.createElement('ul');
    component.className = 'menu';

    MenuTitle.forEach((item, i) => {
      const link = document.createElement('li');
      link.className = 'menu__item';

      const iconWrap = document.createElement('div');
      iconWrap.className = 'menu__icon-wrap';
      const svg = document.createElement('img');
      svg.className = 'menu__img';
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
    });

    return component;
  }
}
