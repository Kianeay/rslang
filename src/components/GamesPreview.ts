import { Button } from './index';

interface GameBlock {
  title: string;
  text: string;
  imgName: string;
  onClick?: () => void;
}

export default class GamesPreview {
  private readonly title: string = '';

  private readonly text: string = '';

  private readonly imgName: string = '';

  private readonly onClick: () => void;

  constructor(game: GameBlock) {
    this.title = game.title;
    this.text = game.text;
    this.imgName = game.imgName;
    this.onClick = game.onClick;
  }

  private createPlayBtn() {
    const playBtn = new Button({
      label: 'play',
      onClick: this.onClick,
    }).render();
    playBtn.classList.add('minigame__start');

    return playBtn;
  }

  private createIcon() {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'minigame__icon-wrap';
    const svg = document.createElement('img');
    svg.className = 'minigame__img';
    svg.src = `src/assets/images/${this.imgName}`;
    iconWrap.append(svg);

    return iconWrap;
  }

  private createDescription() {
    const wrapper = document.createElement('div');
    wrapper.className = 'minigame__wrap';
    const textWrapper = document.createElement('div');
    textWrapper.className = 'minigame__info';
    const title = document.createElement('h3');
    title.className = 'minigame__title';
    title.textContent = this.title;
    const text = document.createElement('p');
    text.className = 'minigame__text';
    text.textContent = this.text;

    textWrapper.append(title, text);
    wrapper.append(textWrapper, this.createPlayBtn());

    return wrapper;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'minigame';

    component.append(this.createIcon(), this.createDescription());

    return component;
  }
}
