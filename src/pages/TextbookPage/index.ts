import { Navigation } from '../../components';

export default class TextbookPage {
  constructor() { }

  private createTitle() {
    const h2 = document.createElement('h2');
    h2.textContent = 'Textbook';

    return h2;
  }

  private createDictionary() {
    const dictionary = document.createElement('div');
    dictionary.className = 'dictionary';

    const h3 = document.createElement('h3');
    h3.textContent = 'Vocabulary difficulty level';

    dictionary.append(h3);
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
