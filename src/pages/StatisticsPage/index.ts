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

  private createStatBlock(num: string, label: string) {
    const wrap = document.createElement('div');
    wrap.className = 'statistics__block';

    const number = document.createElement('span');
    number.className = 'statistics__stat';
    number.textContent = num;

    const text = document.createElement('span');
    text.className = 'statistics__text';
    text.textContent = label;

    wrap.append(number, text);

    return wrap;
  }

  private createMain() {
    const component = document.createElement('div');
    component.className = 'statistics__main';

    const subtitle = document.createElement('p');
    subtitle.className = 'statistics__subtitle';
    subtitle.textContent = 'Today';

    const generalWrap = document.createElement('div');
    generalWrap.className = 'statistics__general';

    const learned = this.createStatBlock('0', 'Learned words');
    learned.classList.add('statistics__stat-big');

    const accuracy = this.createStatBlock('0', 'Accuracy');
    accuracy.classList.add('statistics__stat-big');

    generalWrap.append(learned, accuracy);

    const gamesWrap = document.createElement('div');
    gamesWrap.className = 'statistics__games';

    gamesWrap.append(
      this.createGameBlock('Audio challenge'),
      this.createGameBlock('Sprint'),
    );

    component.append(subtitle, generalWrap, gamesWrap);

    return component;
  }

  private createGameBlock(label: string) {
    const component = document.createElement('div');
    component.className = 'statistics__game';

    const title = document.createElement('p');
    title.className = 'statistics__game__title';
    title.textContent = label;

    const statWrap = document.createElement('div');
    statWrap.className = 'statistics__game-wrap';

    statWrap.append(
      this.createStatBlock('0', 'Learned words'),
      this.createStatBlock('0', 'Accuracy'),
      this.createStatBlock('0', 'In a row'),
    );

    component.append(title, statWrap);

    return component;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'statistics';

    const footer = new Footer().render();

    component.append(this.createTitle('Statistics'), this.createMain(), footer);

    if (!localStorage.getItem('userID')) {
      component.append(this.createLoginBtn());
    }

    return component;
  }
}
