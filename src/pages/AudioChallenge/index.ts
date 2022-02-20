import GameAudioCall, { AudioCallWords } from './Game';
import { DifficultyLevel, Button, Result } from '../../components/index';
import SprintHeader from '../SprintGame/SprintHeader';

export default class AudioChallenge extends GameAudioCall {
  private listeners: (event: KeyboardEvent) => void;

  private isListener: boolean;

  constructor() {
    super();
    this.listeners = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Digit1':
          super.checkAnswer(document.querySelector('.challenge__answer-1'));
          break;
        case 'Digit2': super.checkAnswer(document.querySelector('.challenge__answer-2'));
          break;
        case 'Digit3': super.checkAnswer(document.querySelector('.challenge__answer-3'));
          break;
        case 'Digit4': super.checkAnswer(document.querySelector('.challenge__answer-4'));
          break;
        case 'Space': this.roundGame();
          break;
        default: break;
      }
    };
    this.isListener = false;
  }

  private roundGame() {
    if (!this.isListener) {
      document.addEventListener('keydown', this.listeners);
      this.isListener = true;
    }
    if (this.isAnswer) {
      this.isAnswer = false;
      if (this.currentIndexWord < 19) {
        this.currentIndexWord += 1;
        this.renderGameRound();
        super.playAudio();
      } else {
        this.currentIndexWord = -1;
        this.showResult();
        this.isAnswer = true;
        document.removeEventListener('keydown', this.listeners);
      }
    } else {
      super.showAnswer();
    }
  }

  private showResult() {
    this.isListener = false;
    const container = document.querySelector('.challenge');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const correctArr = this.arrayGame.filter((item) => item.correctAnswer > 0); // исправить!!!!
    const wrongArr = this.arrayGame.filter((item) => item.correctAnswer === 0);
    const result = new Result(this.roundGame.bind(this), correctArr, wrongArr).render();

    container.append(result);
  }

  private createAnswerDiv(text: string, answerClass: string) {
    const div = document.createElement('div');
    div.className = `challenge__answer ${answerClass}`;
    div.textContent = text;
    div.addEventListener('click', (event: Event) => {
      const element = event.currentTarget as HTMLDivElement;
      super.checkAnswer(element);
    });

    return div;
  }

  private createNextButton() {
    const button = new Button({
      label: 'I don\'t no',
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

  private renderGameRound() {
    const header = new SprintHeader(() => console.log(111)).render();
    const container = document.querySelector('.challenge');

    const div = document.createElement('div');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    div.className = 'challenge__answers';
    let arrNum = Array.from({ length: 3 }, () => super.getRandomNum(20));
    arrNum.push(this.currentIndexWord);
    arrNum = [...super.checkArray(arrNum, 20)];
    arrNum = [...arrNum.sort(() => Math.random() - 0.5)];

    div.append(
      this.createAnswerDiv(`1. ${this.arrayGame[arrNum[0]].wordTranslate}`, 'challenge__answer-1'),
      this.createAnswerDiv(`2. ${this.arrayGame[arrNum[1]].wordTranslate}`, 'challenge__answer-2'),
      this.createAnswerDiv(`3. ${this.arrayGame[arrNum[2]].wordTranslate}`, 'challenge__answer-3'),
      this.createAnswerDiv(`4. ${this.arrayGame[arrNum[3]].wordTranslate}`, 'challenge__answer-4'),
    );

    container.append(
      header,
      this.createAudioButton(),
      div,
      this.createNextButton(),
    );

    return container;
  }

  private async getWord(level: string) {
    await super.getWords(level);
    await super.getArrayGame();
    this.roundGame();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'challenge';
    const words = new DifficultyLevel(this.getWord.bind(this)).render();

    container.append(words);

    return container;
  }
}
