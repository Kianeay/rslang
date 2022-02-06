import { Navigation, Button } from '../../components';

export default class MainPage {
  constructor() {}

  render() {
    const component = document.createElement('div');
    component.className = 'main';

    const nav = new Navigation().render();

    const mainWrap = document.createElement('div');
    mainWrap.className = 'main__wrap';
    const h1 = document.createElement('h1');
    h1.textContent = 'RS Lang';
    const mainText = document.createElement('p');
    mainText.className = 'main__subtitle';
    mainText.textContent =
      'Memorizing English words can be fun and challenging. Play games, listen to pronunciation, improve your knowledge. With our app, learning is a joy.';

    const startBtn = new Button({
      label: 'Let’s start',
      onClick: () => {
        location.hash = '#textbook';
      },
    }).render();
    startBtn.classList.add('main__start');

    const loginBtn = new Button({
      label: 'Log in',
      onClick: () => {
        location.hash = '#login';
      },
    }).render();
    loginBtn.classList.add('main__login');

    mainWrap.append(h1, mainText, startBtn);

    const mainImg = document.createElement('img');
    mainImg.className = 'main__img';
    mainImg.src = 'src/assets/images/main.svg';

    component.append(nav, mainWrap, mainImg, loginBtn);

    return component;
  }
}
