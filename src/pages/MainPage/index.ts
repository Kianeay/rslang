import { Navigation, Button } from '../../components';

export default class MainPage {
  constructor() {}

  private createStartBtn() {
    const startBtn = new Button({
      label: 'Let’s start',
      onClick: () => {
        location.hash = '#textbook';
      },
    }).render();
    startBtn.classList.add('main__start');

    return startBtn;
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

  private createTitle() {
    const h1 = document.createElement('h1');
    h1.textContent = 'RS Lang';

    return h1;
  }

  private createMainText() {
    const mainText = document.createElement('p');
    mainText.className = 'main__subtitle';
    mainText.textContent =
      'Memorizing English words can be fun and challenging. Play games, listen to pronunciation, improve your knowledge. With our app, learning is a joy.';

    return mainText;
  }

  private createMainBackground() {
    const mainImg = document.createElement('img');
    mainImg.className = 'main__img';
    mainImg.src = 'src/assets/images/main.svg';

    return mainImg;
  }

  private createMainContent() {
    const mainWrap = document.createElement('div');
    mainWrap.className = 'main__wrap';

    mainWrap.append(
      this.createTitle(),
      this.createMainText(),
      this.createStartBtn(),
    );

    return mainWrap;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'main';

    const nav = new Navigation().render();

    component.append(
      nav,
      this.createMainContent(),
      this.createMainBackground(),
      this.createLoginBtn(),
    );

    return component;
  }
}
