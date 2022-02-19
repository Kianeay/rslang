import { Button, Footer } from '../../components';

export default class StatisticsPage {
  constructor() {}

  private createTitle(content: string) {
    const title = document.createElement('h2');
    title.className = 'statistics__title';
    title.textContent = content;

    return title;
  }

  private createLoginBtn() {
    const loginBtn = new Button({
      label: 'Log in',
      onClick: () => {
        location.hash = '#login';
      },
    }).render();
    loginBtn.classList.add('main__login');

    return loginBtn;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'statistics';

    const footer = new Footer().render();

    component.append(this.createTitle('Statistics'), footer);

    if (localStorage.getItem('userID')) {
      component.append(this.createLoginBtn());
    }

    return component;
  }
}
