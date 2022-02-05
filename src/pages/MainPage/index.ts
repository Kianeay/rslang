import { Navigation } from '../../components';

export default class MainPage {
  constructor() {}

  render() {
    const component = document.createElement('div');
    component.className = 'main';

    const nav = new Navigation().render();
    component.append(nav);

    return component;
  }
}
