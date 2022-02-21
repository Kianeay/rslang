import { Button, Footer } from '../../components';

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
      'Learning English is much more interesting than it seems. It is enough to learn it along with our exciting games. We will help you fall in love with English! ';

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

  private createAbout() {
    const wrapper = document.createElement('div');
    wrapper.className = 'main__about';

    const aboutTitle = document.createElement('h2');
    aboutTitle.className = 'main__about-subtitle';
    aboutTitle.textContent = 'About';

    wrapper.append(
      aboutTitle,
      this.createImageBlock(
        'textbook',
        'The electronic textbook consists of six sections. Each section has 30 pages of 20 words. Here you can significantly expand your vocabulary.',
        'Textbook',
      ),
      this.createImageBlock(
        'games',
        '2 most popular games to improve your English listening and comprehension skills. Check how much points you can get in one minute, making educated guesses about what is right and what is wrong',
        'Games',
      ),
      this.createImageBlock(
        'statistics',
        'Thanks to statistics, you will not only see your progress, but also motivate yourself to better results.',
        'Statistics',
      ),
    );

    return wrapper;
  }

  private createImageBlock(name: string, text: string, title: string) {
    const wrapper = document.createElement('div');
    wrapper.className = 'main__info';
    if (name === 'games') {
      wrapper.classList.add('main__reverse');
    }

    const textWrapper = document.createElement('div');
    textWrapper.className = 'main__text-wrap';

    const aboutTitle = document.createElement('h2');
    aboutTitle.className = 'main__about-title';
    aboutTitle.textContent = title;

    const aboutText = document.createElement('p');
    aboutText.className = 'main__about-text';
    aboutText.textContent = text;

    textWrapper.append(aboutTitle, aboutText);

    wrapper.append(this.createIcon(name), textWrapper);

    return wrapper;
  }

  private createAboutTeam() {
    const wrapper = document.createElement('div');
    wrapper.className = 'main__team';

    const aboutTitle = document.createElement('h2');
    aboutTitle.className = 'main__about-subtitle';
    aboutTitle.textContent = 'Our team';

    wrapper.append(
      aboutTitle,
      this.createImageBlock('', 'About', 'Ekaterina'),
      this.createImageBlock('', 'About', 'Artem'),
      this.createImageBlock('', 'About', 'Elena'),
    );

    return wrapper;
  }

  private createIcon(name: string) {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'main__icon-wrap';
    const svg = document.createElement('img');
    svg.className = 'main__about-img';
    svg.src = `src/assets/images/${name}.svg`;
    iconWrap.append(svg);

    return iconWrap;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'main';

    const footer = new Footer().render();

    component.append(
      this.createMainContent(),
      this.createMainBackground(),
      this.createLoginBtn(),
      this.createAbout(),
      this.createAboutTeam(),
      footer,
    );

    return component;
  }
}
