import { Button } from '../../components';
import SprintHeader from './SprintHeader';

export default class SprintGame {
  private header: SprintHeader;

  private wordEn: string;

  private wordRu: string;

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

    const correctBtn = new Button({ label: 'correct' }).render();
    const wrongBtn = new Button({ label: 'wrong' }).render();

    btnWrap.append(correctBtn, wrongBtn);

    return btnWrap;
  }

  private createWords() {
    const words = document.createElement('div');
    words.className = 'sprint__words';

    const equally = document.createElement('span');
    equally.className = 'sprint__equally';
    equally.textContent = '=';

    words.append(this.createWordEn(), equally, this.createWordRu());

    return words;
  }

  private createWordEn() {
    const wordWrap = document.createElement('div');
    wordWrap.className = 'sprint__wrap';

    const wordEn = document.createElement('span');
    wordEn.className = 'sprint__word-en sprint__word';
    wordEn.textContent = `${this.wordEn}`;

    wordWrap.append(wordEn);

    return wordWrap;
  }

  private createWordRu() {
    const wordWrap = document.createElement('div');
    wordWrap.className = 'sprint__wrap';

    const wordRu = document.createElement('span');
    wordRu.className = 'sprint__word-ru sprint__word';
    wordRu.textContent = `${this.wordRu}`;

    wordWrap.append(wordRu);

    return wordWrap;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'sprint';

    const header = this.header.render();

    const sprintWrap = document.createElement('div');
    sprintWrap.className = 'sprint__wrapper';

    sprintWrap.append(header, this.createMain());

    component.append(sprintWrap);

    return component;
  }
}
