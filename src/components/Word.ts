import { getWord, EndPoints } from '../api';
import { IWord } from '../types';

export default class Word {
  private word: IWord;

  constructor() {}

  async loadCurrentWord(id: string) {
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
    meaning.textContent = this.word.textMeaning;

    const meaningTranslate: HTMLElement = document.querySelector(
      '.word__meaning-translate',
    );
    meaningTranslate.textContent = this.word.textMeaningTranslate;

    const exampleParagraph: HTMLElement = document.querySelector(
      '.word__example-paragraph',
    );
    exampleParagraph.textContent = 'Example';

    const example: HTMLElement = document.querySelector('.word__example');
    example.textContent = this.word.textExample;

    const exampleTranslate: HTMLElement = document.querySelector(
      '.word__example-translate',
    );
    exampleTranslate.textContent = this.word.textExampleTranslate;
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

    return component;
  }
}
