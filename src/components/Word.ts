import { getWord } from '../api';

interface IWord {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string,
}

export default class Word {
  private word: IWord;

  private parent: HTMLDivElement;

  constructor(id: string) {
    this.loadCurrentWord(id);
  }

  private async loadCurrentWord(id: string) {
    this.word = await getWord(id);

    if (this.parent) {
      const image = document.createElement('img');
      image.className = 'word__image';
      image.src = `../${this.word.image}`;
      this.parent.append(image);

      const title = document.createElement('h4');
      title.className = 'word__title';
      title.textContent = this.word.word;
      this.parent.append(title);

      const transcription = document.createElement('p');
      transcription.className = 'word__transcription';
      transcription.textContent = this.word.transcription;
      this.parent.append(transcription);

      const translate = document.createElement('p');
      translate.className = 'word__translate';
      translate.textContent = this.word.wordTranslate;
      this.parent.append(translate);

      const meaning = document.createElement('p');
      meaning.className = 'word__meaning';
      meaning.textContent = this.word.textMeaning;
      this.parent.append(meaning);

      const meaningTranslate = document.createElement('p');
      meaningTranslate.className = 'word__meaning-translate';
      meaningTranslate.textContent = this.word.textMeaningTranslate;
      this.parent.append(meaningTranslate);

      const exampleParagraph = document.createElement('p');
      exampleParagraph.className = 'word__example-paragraph';
      exampleParagraph.textContent = 'Example';
      this.parent.append(exampleParagraph);

      const example = document.createElement('p');
      example.className = 'word__example';
      example.textContent = this.word.textExample;
      this.parent.append(example);

      const exampleTranslate = document.createElement('p');
      exampleTranslate.className = 'word__example-translate';
      exampleTranslate.textContent = this.word.textExampleTranslate;
      this.parent.append(exampleTranslate);
    }
  }

  render() {
    const component = document.createElement('div');
    component.className = 'word__container';

    this.parent = component;
    return component;
  }
}
