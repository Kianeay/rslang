import { Button } from './index';
import { IWord } from '../types/index';

export default class Result {
  constructor(
    private listenerFunction: () => void, // начать игру заново
    private correctArray: IWord[],
    private incorrectArray: IWord[],
    private inRowCount: number,
    private learnedWord: number,
  ) {
    this.listenerFunction = listenerFunction;
  }

  private createTitle() {
    const title = document.createElement('div');
    title.className = 'result__title';
    title.textContent = 'Result';

    return title;
  }

  private createPlayAgainBtn() {
    const button = new Button({
      label: 'play again',
      onClick: this.listenerFunction,
    }).render();

    return button;
  }

  private createCorrectAnswerCount() {
    const correct = document.createElement('div');
    correct.className = 'result__correct-title';
    correct.textContent = 'Correct Answers';

    return correct;
  }

  private createStatistics() {
    const statistic = document.createElement('div');
    statistic.className = 'result__statistic';
    const learned = document.createElement('div');
    learned.className = 'result__learned';
    const accuracy = document.createElement('div');
    accuracy.className = 'result__accuracy';
    const inRow = document.createElement('div');
    inRow.className = 'result__in-row';
    learned.textContent = `${this.learnedWord}`.padStart(2, '0'); // TO DO
    if (learned.textContent === '00') learned.textContent = ' 0';
    const sum = (this.correctArray.length + this.incorrectArray.length);
    let percent = `${Math.round((this.correctArray.length / sum) * 100)}`.padStart(2, '0');
    if (percent === '00') percent = ' 0';
    accuracy.textContent = `${percent}%`;
    inRow.textContent = `${this.inRowCount}`.padStart(2, '0'); // TO DO
    if (inRow.textContent === '00') inRow.textContent = ' 0';

    statistic.append(learned, accuracy, inRow);

    return statistic;
  }

  private createIncorrectAnswerCount() {
    const incorrect = document.createElement('div');
    incorrect.className = 'result__wrong-title';
    incorrect.textContent = 'Mistakes';

    return incorrect;
  }

  private createContainerCorrect() {
    const correct = document.createElement('div');
    correct.className = 'result__correct-container';

    correct.append(
      this.createCorrectAnswerCount(),
    );
    this.createAnswer(this.correctArray, correct);

    return correct;
  }

  private createContainerWrong() {
    const wrong = document.createElement('div');
    wrong.className = 'result__wrong-container';

    wrong.append(
      this.createStatistics(),
      this.createIncorrectAnswerCount(),
    );
    this.createAnswer(this.incorrectArray, wrong);

    return wrong;
  }

  private createAnswer(arr: IWord[], parent: HTMLDivElement) {
    arr.forEach((item) => {
      const container = document.createElement('div');
      container.className = 'result__answer-container';

      container.append(
        this.playButton(item.audio),
        this.createAnswerText(item.word, item.wordTranslate),
      );

      parent.append(container);
    });
  }

  private createAnswerText(word: string, translate: string) {
    const answer = document.createElement('div');
    answer.className = 'result__answer-text';
    answer.textContent = `${word} \u2013 ${translate}`;

    return answer;
  }

  private playButton(audioSrc: string) {
    const button = new Button({
      label: '',
      onClick: () => {
        const audio = new Audio();
        audio.src = `https://react-learnwords2022.herokuapp.com/${audioSrc}`;
        audio.addEventListener('canplay', () => {
          audio.play();
          button.disabled = true;
        });
        audio.addEventListener('ended', () => {
          button.disabled = false;
        });
      },
    }).render();
    button.className = 'result__play-btn';

    return button;
  }

  private buttonContainer() {
    const container = document.createElement('div');
    container.className = 'result__btn-container';

    container.append(
      this.createPlayAgainBtn(),
      this.createButtonTextBook(),
    );

    return container;
  }

  private createButtonTextBook() {
    const button = new Button({
      label: 'textbook',
      onClick: () => {
        window.location.hash = ('#textbook');
      },
    }).render();

    return button;
  }

  private createContainer() {
    const container = document.createElement('div');
    container.className = 'result__container';

    container.append(
      this.createContainerWrong(),
      this.createContainerCorrect(),
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

  render() {
    const result = document.createElement('div');
    result.className = 'result';

    result.append(
      this.createTitle(),
      this.createContainer(),
      this.buttonContainer(),
    );

    if (!localStorage.getItem('userID')) {
      result.append(this.createLoginBtn());
    }

    return result;
  }
}
