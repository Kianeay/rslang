export default class Footer {
  constructor() {}

  private createLink(text: string, link: string) {
    const linkEl = document.createElement('a');
    linkEl.className = 'footer__link';
    linkEl.textContent = text;
    linkEl.href = link;
    linkEl.target = '_blank';

    return linkEl;
  }

  private createIcon() {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'footer__icon-wrap';
    const svg = document.createElement('img');
    svg.className = 'footer__img';
    svg.src = 'src/assets/images/rs_school.svg';
    iconWrap.append(svg);

    return iconWrap;
  }

  render() {
    const component = document.createElement('footer');
    component.className = 'footer';

    const links = document.createElement('div');
    links.className = 'footer__links';

    const year = document.createElement('p');
    year.className = 'footer__year';
    year.textContent = '2022';

    links.append(
      this.createLink('elMP', 'https://github.com/elMP'),
      this.createLink('Kianeay', 'https://github.com/Kianeay'),
      this.createLink('arteemm', 'https://github.com/arteemm'),
    );

    component.append(this.createIcon(), links, year);

    return component;
  }
}
