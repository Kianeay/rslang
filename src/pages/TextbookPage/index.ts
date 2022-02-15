import { getWord, getWords } from '../../api';
import Word from '../../components/Word';
import DifficultyLevel from '../../components/difficultyLevel';

async function loadCurrentWord(id: string) {
  const word: HTMLDivElement = document.querySelector('.word');
  word.innerHTML = '';
  word.append(new Word(id).render());
}

async function loadWords(wordsList: HTMLDivElement, difficultyLevel: string) {
  const words = await getWords(difficultyLevel, '4');

  words.forEach((item, index) => {
    const word = document.createElement('div');
    word.className = 'words__item';
    word.setAttribute('data-id', item.id);

    const wordMeaning = document.createElement('h4');
    wordMeaning.textContent = item.word;
    wordMeaning.className = 'words__word';
    word.append(wordMeaning);

    const wordTranslate = document.createElement('p');
    wordTranslate.textContent = item.wordTranslate;
    wordTranslate.className = 'words__translate';

    word.append(wordTranslate);
    word.addEventListener('click', (event: Event) => {
      const { currentTarget } = event;
      const { id } = (currentTarget as HTMLElement).dataset;

      loadCurrentWord(id);
    });

    if (index === 0) {
      loadCurrentWord(words[index].id);
    }

    wordsList.append(word);
  });
}

export default class TextbookPage {
  constructor() { }

  private createTitle() {
    const title = document.createElement('h2');
    title.textContent = 'Textbook';
    title.className = 'textbook__title';

    return title;
  }

  private createDifficultyLevels() {
    const difficultyLevels = new DifficultyLevel(this.changeActiveDifficultyLevel).render();
    return difficultyLevels;
  }

  private changeActiveDifficultyLevel(level: string) {
    const wordsList: HTMLDivElement = document.querySelector('.words__list');
    wordsList.innerHTML = '';
    loadWords(wordsList, level);
  }

  private async createWordsList(element: HTMLDivElement) {
    const wordsList = document.createElement('div');
    wordsList.className = 'words__list';
    element.append(wordsList);
    loadWords(wordsList, '0');
  }

  private async createCurrentWord(element: HTMLDivElement) {
    const word = document.createElement('div');
    word.className = 'word';
    element.append(word);
  }

  private createDictionary() {
    const dictionary = document.createElement('div');
    dictionary.className = 'words';

    this.createWordsList(dictionary);
    this.createCurrentWord(dictionary);

    return dictionary;
  }

  private createGamesList() {
    const gamesList = document.createElement('div');
    gamesList.className = 'games-list';

    const h2 = document.createElement('h2');
    h2.textContent = 'Games';

    gamesList.append(h2);

    return gamesList;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'textbook';

    component.append(
      this.createTitle(),
      this.createDifficultyLevels(),
      this.createDictionary(),
      this.createGamesList(),
    );

    return component;
  }
}
