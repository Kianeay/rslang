import { getWords } from '../../api';

const difficultyLevelsCount = 6;

export default class TextbookPage {
  constructor() { }

  private createTitle() {
    const title = document.createElement('h2');
    title.textContent = 'Textbook';
    title.className = 'textbook__title';

    return title;
  }

  private createDifficultyLevels() {
    const difficultyLevels = document.createElement('div');
    difficultyLevels.className = 'difficulty';

    const title = document.createElement('h3');
    title.textContent = 'Vocabulary difficulty level';
    title.className = 'difficulty__title';
    difficultyLevels.append(title);

    const difficultyList = document.createElement('ul');
    difficultyList.className = 'difficulty__list';
    for (let i = 0; i < difficultyLevelsCount; i += 1) {
      const difficultyItem = document.createElement('li');
      difficultyItem.className = 'difficulty__item';
      difficultyItem.textContent = String(i);
      difficultyItem.setAttribute('data-num', String(i));

      if (i === 0) {
        difficultyItem.classList.add('difficulty__item-active');
      }

      difficultyList.append(difficultyItem);
      difficultyItem.addEventListener('click', (event: Event) => {
        const { target } = event;

        const difficultyLevel = (target as HTMLElement).dataset.num;
        const wordsList: HTMLDivElement = document.querySelector('.words__list');

        wordsList.innerHTML = '';
        this.loadWords(wordsList, difficultyLevel);

        this.changeActiveDifficultyLevel(target as HTMLElement);
      });
    }
    difficultyLevels.append(difficultyList);

    return difficultyLevels;
  }

  private changeActiveDifficultyLevel(element: HTMLElement) {
    const parent = element.parentElement;

    Array.from(parent.children).forEach((child) => {
      child.classList.remove('difficulty__item-active');
    });

    element.classList.add('difficulty__item-active');
  }

  private async loadWords(wordsList: HTMLDivElement, difficultyLevel: string) {
    const words = await getWords(difficultyLevel, '4');

    words.forEach((item) => {
      const word = document.createElement('div');
      word.className = 'words__item';

      const wordMeaning = document.createElement('h4');
      wordMeaning.textContent = item.word;
      wordMeaning.className = 'words__word';
      word.append(wordMeaning);

      const wordTranslate = document.createElement('p');
      wordTranslate.textContent = item.wordTranslate;
      wordTranslate.className = 'words__translate';
      word.append(wordTranslate);

      wordsList.append(word);
    });
  }

  private async createWordsList(element: HTMLDivElement) {
    const wordsList = document.createElement('div');
    wordsList.className = 'words__list';
    element.append(wordsList);

    this.loadWords(wordsList, '0');
  }

  private createDictionary() {
    const dictionary = document.createElement('div');
    dictionary.className = 'words';

    this.createWordsList(dictionary);

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
