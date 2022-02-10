import { getWords } from '../../api';

export default class TextbookPage {
  constructor() {}

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

    return difficultyLevels;
  }

  private async createWordsList(element: HTMLDivElement) {
    const wordsList = document.createElement('div');
    wordsList.className = 'words__list';
    element.append(wordsList);

    const words = await getWords('0', '4');

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
