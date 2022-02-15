import SprintHeader from './SprintHeader';

export default class SprintGame {
  private header: SprintHeader;

  constructor() {
    this.header = new SprintHeader();
  }

  render() {
    const component = document.createElement('div');
    component.className = 'sprint';

    const header = this.header.render();

    component.append(header);

    return component;
  }
}
