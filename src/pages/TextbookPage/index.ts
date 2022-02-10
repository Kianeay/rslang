import { Navigation } from '../../components';
import { getWords } from '../../api';

export default class TextbookPage {
  constructor() { }

  private createTitle() {
    const h2 = document.createElement('h2');
    h2.textContent = 'Textbook';

    return h2;
  }

  private async loadWords(element: HTMLDivElement) {
    const words = await getWords('0', '4');

    words.forEach(item => {
      const p = document.createElement('p');
      p.textContent = item.word;
      element.append(p);
    });
  }

  private createWordsList() {
    const wordList = document.createElement('div');
    wordList.className = 'dictionary__words-list';

    this.loadWords(wordList);

    return wordList;
  }

  private createDictionary() {
    const dictionary = document.createElement('div');
    dictionary.className = 'dictionary';

    const h3 = document.createElement('h3');
    h3.textContent = 'Vocabulary difficulty level';

    dictionary.append(h3);
    this.createWordsList()
    dictionary.append(this.createWordsList());

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
    component.className = 'textbook__wrap';

    component.append(
      this.createTitle(),
      this.createDictionary(),
      this.createGamesList(),
    );

    return component;
  }
}
