/* eslint-disable no-param-reassign */
import { Button, DifficultyLevel } from '../../components';
import SprintHeader from './SprintHeader';
import {
  getWords,
  createUserWords,
  getUserWords,
  getUserWordsId,
  changeUserWord,
  changeUserStatistics,
  getUserStatistics,
} from '../../api';
import { IWord } from '../../types';

interface WordPair {
  word: string;
  translate: string;
  correct: boolean;
  id: string;
}

export default class SprintGame {
  private header: SprintHeader;

  private wordEn: Element;

  private wordRu: Element;

  private correctBtn: HTMLButtonElement;

  private wrongBtn: HTMLButtonElement;

  private equally: Element;

  private question: Element;

  private words: IWord[];

  private wordsWrong: IWord[];

  private wordsArray: WordPair[] = [];

  private levelElem: Element;

  private component: Element;

  private sprintWrap: Element;

  private currentWordIndex: number = 0;

  private userId: string = localStorage.getItem('userID') || null;

  private correctAnswers: Number[] = [];

  private wrongAnswers: Number[] = [];

  private rowAnswer: number = 0;

  constructor() {
    this.header = new SprintHeader(this.stopGame.bind(this));
  }

  private createMain() {
    const main = document.createElement('div');
    main.className = 'sprint__main';

    this.question = document.createElement('span');
    this.question.className = 'sprint__question';
    this.question.textContent = '?';

    main.append(this.createWords(), this.question, this.createButtons());

    return main;
  }

  private createButtons() {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'sprint__buttons';

    this.correctBtn = new Button({
      label: 'correct',
      onClick: this.onCorrectClick.bind(this),
    }).render();
    this.wrongBtn = new Button({
      label: 'wrong',
      onClick: this.onWrongClick.bind(this),
    }).render();

    btnWrap.append(this.correctBtn, this.wrongBtn);

    return btnWrap;
  }

  // статистика по конкретному слову
  private async createWordStat(correct: boolean) {
    // есть ли уже статистика по слову
    const word = await getUserWordsId(
      this.userId,
      this.wordsArray[this.currentWordIndex].id,
    );
    // если на слово праавильно ответили
    if (correct) {
      if (!word) {
        await createUserWords(
          this.userId,
          this.wordsArray[this.currentWordIndex].id,
          {
            difficulty: 'easy',
            optional: {
              status: 'simple',
              new: true,

              sprint: {
                correctAnswers: 1,
              },

              audio: {
                correctAnswers: 0,
              },
            },
          },
        );
      } else if (
        word.optional.sprint.correctAnswers +
          word.optional.audio.correctAnswers >
        2
      ) {
        await changeUserWord(
          this.userId,
          this.wordsArray[this.currentWordIndex].id,
          {
            difficulty: 'weak',
            optional: {
              status: 'learned',

              sprint: {
                correctAnswers: (word.optional.sprint.correctAnswers += 1),
              },
            },
          },
        );
      } else {
        await changeUserWord(
          this.userId,
          this.wordsArray[this.currentWordIndex].id,
          {
            difficulty: 'weak',
            optional: {
              new: true,
              sprint: {
                correctAnswers: word.optional.sprint
                  ? (word.optional.sprint.correctAnswers += 1)
                  : 1,
              },
            },
          },
        );
      }
    } else if (!word) {
      await createUserWords(
        this.userId,
        this.wordsArray[this.currentWordIndex].id,
        {
          difficulty: 'easy',
          optional: {
            status: 'simple',
            new: true,

            sprint: {
              correctAnswers: 0,
            },

            audio: {
              correctAnswers: 0,
            },
          },
        },
      );
    }
  }

  // статистика общая
  private async addStatistics() {
    const word = await getUserWordsId(
      this.userId,
      this.wordsArray[this.currentWordIndex].id,
    );

    const statistics = await getUserStatistics(this.userId);

    if (!word) {
      if (statistics) {
        await changeUserStatistics(this.userId, {
          optional: {
            new: (statistics.optional.new += 1),

            sprint: {
              learned: 10,
              correctAnswers: 12,
              count: 100,
            },

            audio: {
              learned: 10,
              correctAnswers: 10,
              count: 100,
            },
          },
        });
      } else {
        await changeUserStatistics(this.userId, {
          optional: {
            new: 50,

            sprint: {
              learned: 10,
              correctAnswers: 12,
              count: 100,
            },

            audio: {
              learned: 10,
              correctAnswers: 10,
              count: 100,
            },
          },
        });
      }
    }

    // console.log(await getUserStatistics(this.userId));
  }

  private onCorrectClick() {
    if (this.wordsArray[this.currentWordIndex].correct) {
      this.correctAnswers.push(this.currentWordIndex);
      this.rowAnswer += 1;

      if (this.rowAnswer >= 3 && this.rowAnswer <= 5) {
        this.header.updateScore(20);
        this.header.updatePlusScore(20);
      } else if (this.rowAnswer >= 6) {
        this.header.updateScore(30);
        this.header.updatePlusScore(30);
      } else {
        this.header.updateScore(10);
        this.header.updatePlusScore(10);
      }

      if (this.userId) {
        this.createWordStat(true);
      }

      this.question.classList.add('green');
      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.question.classList.remove('green');

        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    } else {
      this.wrongAnswers.push(this.currentWordIndex);
      this.rowAnswer = 0;
      this.header.updatePlusScore(10);

      if (this.userId) {
        this.createWordStat(false);
      }

      this.question.classList.add('red');

      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.question.classList.remove('red');

        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    }
  }

  private onWrongClick() {
    if (this.wordsArray[this.currentWordIndex].correct) {
      this.wrongAnswers.push(this.currentWordIndex);
      this.rowAnswer = 0;
      this.header.updatePlusScore(10);

      if (this.userId) {
        this.createWordStat(false);
      }

      this.question.classList.add('red');
      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.question.classList.remove('red');

        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    } else {
      this.correctAnswers.push(this.currentWordIndex);
      this.rowAnswer += 1;

      if (this.rowAnswer >= 3 && this.rowAnswer <= 5) {
        this.header.updateScore(20);
        this.header.updatePlusScore(20);
      } else if (this.rowAnswer >= 6) {
        this.header.updateScore(30);
        this.header.updatePlusScore(30);
      } else {
        this.header.updateScore(10);
        this.header.updatePlusScore(10);
      }

      if (this.userId) {
        this.createWordStat(true);
      }

      this.question.classList.add('green');
      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.question.classList.remove('green');

        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    }
  }

  private changeWordsContent() {
    this.currentWordIndex += 1;
    if (this.currentWordIndex === 20) {
      this.stopGame();
      return;
    }
    this.wordEn.textContent = `${this.wordsArray[this.currentWordIndex].word}`;
    this.wordRu.textContent = `${
      this.wordsArray[this.currentWordIndex].translate
    }`;
  }

  private createWords() {
    const words = document.createElement('div');
    words.className = 'sprint__words';

    this.equally = document.createElement('span');
    this.equally.className = 'sprint__equally';
    this.equally.textContent = '=';

    words.append(this.createWordEn(), this.equally, this.createWordRu());

    return words;
  }

  private createWordEn() {
    const wordWrap = document.createElement('div');
    wordWrap.className = 'sprint__wrap';

    this.wordEn = document.createElement('span');
    this.wordEn.className = 'sprint__word-en sprint__word';
    this.wordEn.textContent = `${this.wordsArray[this.currentWordIndex].word}`;

    wordWrap.append(this.wordEn);

    return wordWrap;
  }

  private createWordRu() {
    const wordWrap = document.createElement('div');
    wordWrap.className = 'sprint__wrap';

    this.wordRu = document.createElement('span');
    this.wordRu.className = 'sprint__word-ru sprint__word';
    this.wordRu.textContent = `${
      this.wordsArray[this.currentWordIndex].translate
    }`;

    wordWrap.append(this.wordRu);

    return wordWrap;
  }

  randomInteger(min: number, max: number) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  async getWords(level: string) {
    this.levelElem.remove();
    const pageNum = this.randomInteger(0, 29).toString();
    const pageNumWrong = this.randomInteger(0, 29).toString();
    // this.words = await getWords(level, pageNum);
    this.words = await getWords('0', '0');

    this.wordsWrong = await getWords(level, pageNumWrong);
    this.createWordsArray();
  }

  private createWordsArray() {
    // this.wordsArray = new Set();
    const correctWords = new Set();
    while (correctWords.size < 8) {
      const num = this.randomInteger(0, 19);
      correctWords.add(num);
    }
    while (correctWords.size < 20) {
      const num = this.randomInteger(0, 19);
      correctWords.add(num);
    }
    correctWords.forEach((value) => {
      if (this.wordsArray.length < 8) {
        const pair = {
          word: this.words[+value].word,
          translate: this.words[+value].wordTranslate,
          correct: true,
          id: this.words[+value].id,
        };

        this.wordsArray.push(pair);
      } else {
        // const num = this.randomInteger(0, 19);
        const pair = {
          word: this.words[+value].word,
          translate: this.wordsWrong[+value].wordTranslate,
          correct: false,
          id: this.words[+value].id,
        };

        this.wordsArray.push(pair);
      }
    });

    this.shuffleObject(this.wordsArray);
    console.log(this.wordsArray);
    this.startGame();
  }

  private shuffleObject(array: WordPair[]) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private startGame() {
    const header = this.header.render();

    this.sprintWrap = document.createElement('div');
    this.sprintWrap.className = 'sprint__wrapper';

    this.sprintWrap.append(header, this.createMain());

    this.component.append(this.sprintWrap);
    this.header.setTimer();
  }

  private stopGame() {
    this.sprintWrap.remove();
    this.component.textContent = `correct: ${this.correctAnswers}, wrong: ${this.wrongAnswers}`;
  }

  render() {
    this.component = document.createElement('div');
    this.component.className = 'sprint';
    this.levelElem = new DifficultyLevel(this.getWords.bind(this)).render();

    this.component.append(this.levelElem);
    return this.component;
  }
}
