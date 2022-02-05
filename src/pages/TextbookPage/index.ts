import { Navigation } from '../../components';

export default class TextbookPage {
  constructor() {}

  render() {
    const component = document.createElement('div');
    component.className = 'textbook';

    const nav = new Navigation().render();
    component.append(nav);

    return component;
  }
}
