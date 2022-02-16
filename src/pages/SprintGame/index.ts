/* eslint-disable no-param-reassign */
import { Button, DifficultyLevel } from '../../components';
import SprintHeader from './SprintHeader';
import { getWords } from '../../api';
import { IWord } from '../../types';

interface WordPair {
  word: string;
  translate: string;
  correct: boolean;
}

export default class SprintGame {
  private header: SprintHeader;

  private wordEn: Element;

  private wordRu: Element;

  private correctBtn: HTMLButtonElement;

  private wrongBtn: HTMLButtonElement;

  private equally: Element;

  private words: IWord[];

  private wordsWrong: IWord[];

  private wordsArray: WordPair[] = [];

  private levelElem: Element;

  private component: Element;

  private currentWordIndex: number = 0;

  constructor() {
    this.header = new SprintHeader();
  }

  private createMain() {
    const main = document.createElement('div');
    main.className = 'sprint__main';

    const question = document.createElement('span');
    question.className = 'sprint__question';
    question.textContent = '?';

    main.append(this.createWords(), question, this.createButtons());

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

  private onCorrectClick() {
    if (this.wordsArray[this.currentWordIndex].correct) {
      this.equally.classList.add('green');

      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.equally.classList.remove('green');
        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    } else {
      this.equally.classList.add('red');

      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.equally.classList.remove('red');
        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    }
  }

  private onWrongClick() {
    if (this.wordsArray[this.currentWordIndex].correct) {
      this.equally.classList.add('red');
      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.equally.classList.remove('red');
        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    } else {
      this.equally.classList.add('green');
      this.correctBtn.disabled = true;
      this.wrongBtn.disabled = true;

      setTimeout(() => {
        this.equally.classList.remove('green');
        this.changeWordsContent();

        this.correctBtn.disabled = false;
        this.wrongBtn.disabled = false;
      }, 1500);
    }
  }

  private changeWordsContent() {
    this.currentWordIndex += 1;
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
    this.words = await getWords(level, pageNum);
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
        };

        this.wordsArray.push(pair);
      } else {
        // const num = this.randomInteger(0, 19);
        const pair = {
          word: this.words[+value].word,
          translate: this.wordsWrong[+value].wordTranslate,
          correct: false,
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

    const sprintWrap = document.createElement('div');
    sprintWrap.className = 'sprint__wrapper';

    sprintWrap.append(header, this.createMain());

    this.component.append(sprintWrap);
  }

  render() {
    this.component = document.createElement('div');
    this.component.className = 'sprint';
    this.levelElem = new DifficultyLevel(this.getWords.bind(this)).render();

    this.component.append(this.levelElem);
    return this.component;
  }
}
