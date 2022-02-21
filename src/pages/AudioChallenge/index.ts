import GameAudioCall, { AudioCallWords } from './Game';
import { DifficultyLevel, Button, Result } from '../../components/index';

export default class AudioChallenge extends GameAudioCall {
  private listeners: (event: KeyboardEvent) => void;

  private answerCheck: (event: Event) => void;

  private spaceListener: (event: KeyboardEvent) => void;

  private isListener: boolean;

  private intervalId: NodeJS.Timer; // eslint-disable-line no-undef

  constructor() {
    super();
    this.isListener = false;
    this.listeners = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Digit1':
          super.checkAnswer(document.querySelector('.challenge__answer-1'));
          break;
        case 'Digit2':
          super.checkAnswer(document.querySelector('.challenge__answer-2'));
          break;
        case 'Digit3':
          super.checkAnswer(document.querySelector('.challenge__answer-3'));
          break;
        case 'Digit4':
          super.checkAnswer(document.querySelector('.challenge__answer-4'));
          break;
        default:
          break;
      }
      clearInterval(this.intervalId);
      this.removeListeners();
    };

    this.spaceListener = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.repeat === false) {
        this.roundGame();
      }
    };

    this.answerCheck = (event: Event) => {
      clearInterval(this.intervalId);
      const element = event.currentTarget as HTMLDivElement;
      super.checkAnswer(element);
      this.removeListeners();
    };
  }

  private roundGame() {
    if (!this.isListener) {
      document.addEventListener('keydown', this.listeners);
      this.isListener = true;
    }
    if (this.isAnswer) {
      this.isAnswer = false;
      super.changeButton();
      if (this.currentIndexWord < 19) {
        this.currentIndexWord += 1;
        this.renderGameRound();
        super.playAudio();
        this.setTimer();
        const score = document.querySelector('.sprint__score-count');
        super.updateScorePlus();
        score.textContent = `${this.score}`;
      } else {
        this.score = 0;
        this.scoreUpdate = 10;
        this.currentIndexWord = -1;
        this.showResult();
        this.isAnswer = true;
        document.removeEventListener('keydown', this.spaceListener);
      }
    } else {
      this.isAnswer = true;
      this.removeListeners();
      clearInterval(this.intervalId);
      this.changeButton();
      super.showAnswer();
    }
  }

  private removeListeners() {
    this.isListener = false;
    document.removeEventListener('keydown', this.listeners);
    const buttons = document.querySelectorAll(
      '.challenge__answer',
    ) as NodeListOf<HTMLDivElement>; // eslint-disable-line no-undef
    buttons.forEach((item) => item.removeEventListener('click', this.answerCheck));
  }

  private showResult() {
    this.isListener = false;
    const container = document.querySelector('.challenge');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const result = new Result(
      this.startGame.bind(this),
      this.correctArr(),
      this.wrongArr(),
      this.greatestSeries,
    ).render();

    container.append(result);

    super.addStatistics();
  }

  private createAnswerDiv(text: string, answerClass: string) {
    const div = document.createElement('div');
    div.className = `challenge__answer ${answerClass}`;
    div.textContent = text;
    div.addEventListener('click', this.answerCheck);

    return div;
  }

  private createNextButton() {
    const button = new Button({
      label: "I don't no",
      onClick: this.roundGame.bind(this),
    }).render();
    button.classList.add('challenge__button');

    return button;
  }

  private createAudioButton() {
    const button = new Button({
      label: '',
      onClick: super.playAudio.bind(this),
    }).render();
    button.className = 'challenge__play-audio';

    return button;
  }

  private setTimer() {
    const timeElem = document.querySelector('.sprint__time-count');
    timeElem.textContent = '15';
    const start = () => {
      timeElem.textContent = `${+timeElem.textContent - 1}`.padStart(2, '0');
      if (+timeElem.textContent === 0) {
        this.clearTimer();
      }
    };
    this.intervalId = setInterval(start, 1000);
  }

  private clearTimer() {
    clearInterval(this.intervalId);
    this.showAnswer();
    this.isAnswer = true;
    super.changeButton();
    this.removeListeners();
  }

  private renderGameRound() {
    const container = document.querySelector('.challenge__answers');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    let arrNum = Array.from({ length: 3 }, () => super.getRandomNum(20));
    arrNum.push(this.currentIndexWord);
    arrNum = [...super.checkArray(arrNum, 20)];
    arrNum = [...arrNum.sort(() => Math.random() - 0.5)];

    container.append(
      this.createAnswerDiv(
        `1. ${this.arrayGame[arrNum[0]].wordTranslate}`,
        'challenge__answer-1',
      ),
      this.createAnswerDiv(
        `2. ${this.arrayGame[arrNum[1]].wordTranslate}`,
        'challenge__answer-2',
      ),
      this.createAnswerDiv(
        `3. ${this.arrayGame[arrNum[2]].wordTranslate}`,
        'challenge__answer-3',
      ),
      this.createAnswerDiv(
        `4. ${this.arrayGame[arrNum[3]].wordTranslate}`,
        'challenge__answer-4',
      ),
    );

    return container;
  }

  private renderGame() {
    const container = document.querySelector('.challenge');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const div = document.createElement('div');
    div.className = 'challenge__answers';

    container.append(
      this.header.render(),
      this.createAudioButton(),
      div,
      this.createNextButton(),
      this.createLoginBtn(),
    );

    return container;
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

  private startGame() {
    this.renderGame();
    this.roundGame();
    document.addEventListener('keydown', this.spaceListener);
    document.addEventListener('keyup', (event) => event.preventDefault());
  }

  private async getWord(level: string) {
    await super.getWords(level);
    await super.getArrayGame();
    this.startGame();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'challenge';
    const words = new DifficultyLevel(this.getWord.bind(this)).render();

    container.append(
      words,
      this.createLoginBtn(),
    );

    return container;
  }
}
