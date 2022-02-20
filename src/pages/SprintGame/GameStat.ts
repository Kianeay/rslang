import { Button } from '../../components';
import { WordPair } from '.';

interface GameStatProps {
  correct: number[];
  wrong: number[];
  words: WordPair[];
}

export default class GameStat {
  private component: Element;

  constructor(private data: GameStatProps) {}

  private createTitle() {
    const titleWrap = document.createElement('div');
    titleWrap.className = 'game-stat__title-wrap';

    const title = document.createElement('h3');
    title.className = 'game-stat__title';
    title.textContent = 'result';

    titleWrap.append(title);

    return titleWrap;
  }

  private createMain() {
    const main = document.createElement('div');
    main.className = 'game-stat__main';

    const statWrap = document.createElement('div');
    statWrap.className = 'game-stat__stat-wrap';

    const accuracy = `${
      Math.round(
        (this.data.correct.length /
          (this.data.correct.length + this.data.wrong.length)) *
          100,
      ) || 0
    }%`;

    statWrap.append(this.createStatBlock(accuracy, 'Accuracy'));

    const answersWrap = document.createElement('div');
    answersWrap.className = 'game-stat__wrap';

    const mistakeTitle = document.createElement('p');
    mistakeTitle.className = 'game-stat__subtitle';
    mistakeTitle.textContent = `Mistakes - ${this.data.wrong.length}`;

    answersWrap.append(mistakeTitle);

    this.data.wrong.forEach((el) => {
      const word = document.createElement('p');
      word.className = 'game-stat__word';
      word.textContent = `${this.data.words[el].word} - ${this.data.words[el].translate}`;

      answersWrap.append(word);
    });

    const correctTitle = document.createElement('p');
    correctTitle.className = 'game-stat__subtitle';
    correctTitle.textContent = `Correct answers - ${this.data.correct.length}`;

    answersWrap.append(correctTitle);

    this.data.correct.forEach((el) => {
      const word = document.createElement('p');
      word.className = 'game-stat__word';
      word.textContent = `${this.data.words[el].word} - ${this.data.words[el].translate}`;

      answersWrap.append(word);
    });

    main.append(statWrap, answersWrap);

    return main;
  }

  private createStatBlock(num: string, label: string) {
    const wrap = document.createElement('div');
    wrap.className = 'game-stat__block';

    const number = document.createElement('span');
    number.className = 'game-stat__stat';
    number.textContent = num;

    const text = document.createElement('span');
    text.className = 'game-stat__text';
    text.textContent = label;

    wrap.append(number, text);

    return wrap;
  }

  private createNav() {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'game-stat__btn-wrap';

    const playBtn = new Button({
      label: 'play again',
      onClick: () => {
        window.location.hash = '';
        window.location.hash = '#sprint';
      },
    }).render();
    const toTextbookBtn = new Button({
      label: 'textbook',
      onClick: () => {
        window.location.hash = '#textbook';
      },
    }).render();

    btnWrap.append(playBtn, toTextbookBtn);

    return btnWrap;
  }

  render() {
    this.component = document.createElement('div');
    this.component.className = 'game-stat';

    this.component.append(
      this.createTitle(),
      this.createMain(),
      this.createNav(),
    );
    return this.component;
  }
}
