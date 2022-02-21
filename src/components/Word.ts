import { getWord, createUserWords, changeUserWord, WordStat, EndPoints } from '../api';
import { IWord } from '../types';
import { Button } from '../components';

export default class Word {
  private word: IWord;

  constructor() { }

  private changeWordInList(id: string, status: string) {
    const level = document.querySelector('.difficulty__item-active');
    const wordsInList = document.querySelectorAll('.words__item');

    if ((level as HTMLElement).dataset.num === 'hard') {
      Array.from(wordsInList).forEach((item) => {
        if (id === (item as HTMLElement).dataset.id) {
          const parent = item.parentNode;
          parent.removeChild(item);
          if (parent.children.length === 0) {
            const word = document.querySelector('.word');
            word.classList.add('word-invisible');
          }
        }
      });
    } else {
      Array.from(wordsInList).forEach((item) => {
        if (id === (item as HTMLElement).dataset.id) {
          if (status === 'difficult') {
            item.classList.add('words__item-hard');
            item.classList.remove('words__item-learned');
            item.setAttribute('data-status', 'difficult');
          }
          if (status === 'learned') {
            item.classList.remove('words__item-hard');
            item.classList.add('words__item-learned');
            item.setAttribute('data-status', 'learned');
          }
          if (status === 'simple') {
            item.classList.remove('words__item-hard');
            item.classList.remove('words__item-learned');
            item.removeAttribute('data-status');
          }
        }
      });
    }
  }

  private async workWithDifficultWords(event: Event) {
    const { currentTarget } = event;
    const { word, status } = (currentTarget as HTMLElement).dataset;

    const user = localStorage.getItem('userID');

    if ((currentTarget as HTMLElement).classList.contains('word__simple')) {
      await changeUserWord(user, word, { optional: { status: 'simple' } });

      (currentTarget as HTMLElement).textContent = 'It\'s difficult';
      (currentTarget as HTMLElement).classList.remove('word__simple');

      this.changeWordInList(word, 'simple');
    } else {
      const options = {
        status: 'difficult',
        newWord: 'false',
        sprint: { correctAnswers: 0 },
        audio: { correctAnswers: 0 },
      };

      const response = await changeUserWord(user, word, { optional: { status: 'difficult' } });
      if (!response) {
        await createUserWords(user, word, { optional: options });
      }

      (currentTarget as HTMLElement).textContent = 'It\'s simple';
      (currentTarget as HTMLElement).classList.add('word__simple');

      const learnedButton = document.querySelector('.word__learned');
      learnedButton.textContent = 'I know it';
      learnedButton.classList.remove('word__notlearned');

      this.changeWordInList(word, 'difficult');
    }
  }

  private async workWithLearnedWords(event: Event) {
    const { currentTarget } = event;
    const { word } = (currentTarget as HTMLElement).dataset;

    const user = localStorage.getItem('userID');

    if ((currentTarget as HTMLElement).classList.contains('word__notlearned')) {
      await changeUserWord(user, word, { optional: { status: 'simple' } });

      (currentTarget as HTMLElement).textContent = 'I know it!';
      (currentTarget as HTMLElement).classList.remove('word__notlearned');

      this.changeWordInList(word, 'simple');
    } else {
      const response = await changeUserWord(user, word, { optional: { status: 'learned' } });
      if (!response) {
        const options = {
          status: 'learned',
          newWord: 'false',
          sprint: { correctAnswers: 0 },
          audio: { correctAnswers: 0 },
        };

        await createUserWords(user, word, { optional: options });
      }

      (currentTarget as HTMLElement).textContent = 'Need to repeat';
      (currentTarget as HTMLElement).classList.add('word__notlearned');

      const difficultButton = document.querySelector('.word__difficult');
      difficultButton.textContent = 'It\'s difficult';
      difficultButton.classList.remove('word__simple');

      this.changeWordInList(word, 'learned');
    }
  }

  async loadCurrentWord(id: string, options: WordStat = {}) {
    this.word = await getWord(id);

    const image: HTMLImageElement = document.querySelector('.word__image');
    image.src = EndPoints.BASE_URL + this.word.image;

    const title: HTMLElement = document.querySelector('.word__title');
    title.textContent = this.word.word;

    const transcription: HTMLElement = document.querySelector(
      '.word__transcription',
    );
    transcription.textContent = this.word.transcription;

    const translate: HTMLElement = document.querySelector('.word__translate');
    translate.textContent = this.word.wordTranslate;

    const meaning: HTMLElement = document.querySelector('.word__meaning');
    meaning.innerHTML = this.word.textMeaning;

    const meaningTranslate: HTMLElement = document.querySelector(
      '.word__meaning-translate',
    );
    meaningTranslate.textContent = this.word.textMeaningTranslate;

    const exampleParagraph: HTMLElement = document.querySelector(
      '.word__example-paragraph',
    );
    exampleParagraph.textContent = 'Example';

    const example: HTMLElement = document.querySelector('.word__example');
    example.innerHTML = this.word.textExample;

    const exampleTranslate: HTMLElement = document.querySelector(
      '.word__example-translate',
    );
    exampleTranslate.textContent = this.word.textExampleTranslate;

    const user = localStorage.getItem('userID');
    if (user) {
      const difficultButton: HTMLElement = document.querySelector('.word__difficult');
      difficultButton.setAttribute('data-word', this.word.id);
      if (options.status === 'difficult') {
        difficultButton.textContent = 'It\'s simple';
        difficultButton.classList.add('word__simple');
      } else {
        difficultButton.textContent = 'It\'s difficult';
        difficultButton.classList.remove('word__simple');
      }

      const learnedButton: HTMLElement = document.querySelector('.word__learned');
      learnedButton.setAttribute('data-word', this.word.id);
      if (options.status === 'learned') {
        learnedButton.textContent = 'Need to repeat';
        learnedButton.classList.add('word__notlearned');
      } else {
        learnedButton.textContent = 'I know it';
        learnedButton.classList.remove('word__notlearned');
      }
    }
  }

  render() {
    const component = document.createElement('div');
    component.className = 'word__container';

    const image = document.createElement('img');
    image.className = 'word__image';
    component.append(image);

    const title = document.createElement('h4');
    title.className = 'word__title';
    component.append(title);

    const transcription = document.createElement('p');
    transcription.className = 'word__transcription';
    component.append(transcription);

    const translate = document.createElement('p');
    translate.className = 'word__translate';
    component.append(translate);

    const meaning = document.createElement('p');
    meaning.className = 'word__meaning';
    component.append(meaning);

    const meaningTranslate = document.createElement('p');
    meaningTranslate.className = 'word__meaning-translate';
    component.append(meaningTranslate);

    const exampleParagraph = document.createElement('p');
    exampleParagraph.className = 'word__example-paragraph';
    component.append(exampleParagraph);

    const example = document.createElement('p');
    example.className = 'word__example';
    component.append(example);

    const exampleTranslate = document.createElement('p');
    exampleTranslate.className = 'word__example-translate';
    component.append(exampleTranslate);

    const user = localStorage.getItem('userID');
    if (user) {
      const buttonsWrapper = document.createElement('div');
      buttonsWrapper.className = 'word__buttons';
      const hardWordButton = new Button({
        label: 'It\'s difficult',
        onClick: (event: Event) => {
          this.workWithDifficultWords(event);
        },
      }).render();
      hardWordButton.classList.add('word__difficult');
      buttonsWrapper.append(hardWordButton);

      const learnedWordButton = new Button({
        label: 'I know it!',
        onClick: (event: Event) => {
          this.workWithLearnedWords(event);
        },
      }).render();
      learnedWordButton.classList.add('word__learned');
      buttonsWrapper.append(learnedWordButton);

      component.append(buttonsWrapper);
    }

    return component;
  }
}
