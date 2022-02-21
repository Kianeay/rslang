import { getWords, getWord, getUserWords, getUserWordsId, UsersWordParameter, WordStat } from '../../api';
import { Word } from '../../components';
import DifficultyLevel from '../../components/DifficultyLevel';
import Pagination from '../../components/Pagination';
import { IWord } from '../../types';

interface userWord {
  userId: string,
  wordId: string,
  optional: WordStat,
}

export default class TextbookPage {
  private currentWord: Word = null;

  private difficultyLevel: string;

  private pagination: Pagination;

  constructor() { }

  private async loadCurrentWord(id: string, options: WordStat = {}) {
    const word: HTMLDivElement = document.querySelector('.word');

    if (!this.currentWord) {
      this.currentWord = new Word();
      word.append(this.currentWord.render());
    }
    this.currentWord.loadCurrentWord(id, options);
  }

  private async loadWords(wordsList: HTMLDivElement, difficultyLevel: string, page: string) {
    const words = await getWords(difficultyLevel, page);

    localStorage.setItem('textbook-difficulty', difficultyLevel);
    localStorage.setItem('textbook-page', page);

    const user = localStorage.getItem('userID');
    let userWords: userWord[];
    if (user) {
      userWords = await getUserWords(user);
    }

    while (wordsList.firstChild) {
      wordsList.removeChild(wordsList.firstChild);
    }

    const pagination = document.querySelector('.pagination');
    pagination.classList.remove('pagination-invisible');

    words.forEach((item, index) => {
      const word = document.createElement('div');
      word.className = 'words__item';
      word.setAttribute('data-id', item.id);

      const options = userWords.find((userItem) => userItem.wordId === item.id);
      if (options) {
        this.setWordStatus(word, options.optional);
      }

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
        const { id, status } = (currentTarget as HTMLElement).dataset;
        this.loadCurrentWord(id, { status });
      });

      if (index === 0) {
        if (options) {
          const { status } = options.optional;
          this.loadCurrentWord(words[index].id, { status });
        } else {
          this.loadCurrentWord(words[index].id);
        }
      }

      wordsList.append(word);
    });
  }

  private async loadHardWords(wordsList: HTMLDivElement) {
    const user = localStorage.getItem('userID');

    while (wordsList.firstChild) {
      wordsList.removeChild(wordsList.firstChild);
    }

    const pagination = document.querySelector('.pagination');
    pagination.classList.add('pagination-invisible');

    if (user) {
      const uWords: userWord[] = await getUserWords(user);
      const hardWords: Array<string> = [];

      uWords.forEach((item) => {
        if (item.optional.status === 'difficult') {
          hardWords.push(item.wordId);
        }
      });

      hardWords.forEach((item) => {
        this.createHardWord(wordsList, item);
      });
    }
  }

  private async createHardWord(wordslist: HTMLElement, id: string) {
    const hardWord = await getWord(id);

    const word = document.createElement('div');
    word.className = 'words__item';
    word.classList.add('words__item-hard');
    word.setAttribute('data-id', hardWord.id);
    word.setAttribute('data-status', 'hard');

    const wordMeaning = document.createElement('h4');
    wordMeaning.textContent = hardWord.word;
    wordMeaning.className = 'words__word';
    word.append(wordMeaning);

    const wordTranslate = document.createElement('p');
    wordTranslate.textContent = hardWord.wordTranslate;
    wordTranslate.className = 'words__translate';
    word.append(wordTranslate);

    word.addEventListener('click', (event: Event) => {
      const { currentTarget } = event;
      const { id, status } = (currentTarget as HTMLElement).dataset;

      this.loadCurrentWord(id, { status });
    });

    if (wordslist.children.length === 0) {
      this.loadCurrentWord(hardWord.id);
    }

    wordslist.append(word);
  }

  private async setWordStatus(word: HTMLDivElement, options: WordStat) {
    if (options.status === 'difficult') {
      word.classList.add('words__item-hard');
    }
    if (options.status === 'learned') {
      word.classList.add('words__item-learned');
    }
    word.setAttribute('data-status', options.status);
  }

  private createTitle() {
    const title = document.createElement('h2');
    title.textContent = 'Textbook';
    title.className = 'textbook__title';

    return title;
  }

  private createDifficultyLevels() {
    const difficultyLevels = new DifficultyLevel(
      this.changeActiveDifficultyLevel.bind(this),
    ).render();
    const level = localStorage.getItem('textbook-difficulty');
    if (typeof level === 'string') {
      this.difficultyLevel = level;
    } else {
      this.difficultyLevel = '0';
    }

    return difficultyLevels;
  }

  private changeActiveDifficultyLevel(level: string) {
    const wordsList: HTMLDivElement = document.querySelector('.words__list');

    if (level !== 'hard') {
      this.difficultyLevel = level;
      this.loadWords(wordsList, level, '0');
      this.pagination.refreshActivePage('0');
    } else {
      this.loadHardWords(wordsList);
    }
  }

  private createWordsList(element: HTMLDivElement) {
    const wordsList = document.createElement('div');
    wordsList.className = 'words__list';

    const level = localStorage.getItem('textbook-difficulty');
    const page = localStorage.getItem('textbook-page');
    if (typeof level === 'string' && typeof page === 'string') {
      this.loadWords(wordsList, level, page);
    } else {
      this.loadWords(wordsList, '0', '0');
    }
    element.append(wordsList);
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

  private createPagination() {
    const pagination = new Pagination(this.changePage.bind(this));

    this.pagination = pagination;
    return pagination.render();
  }

  private createGamesList() {
    const gamesList = document.createElement('div');
    gamesList.className = 'games-list';

    const h2 = document.createElement('h2');
    h2.textContent = 'Games';

    gamesList.append(h2);

    return gamesList;
  }

  private changePage(page: string) {
    const wordsList: HTMLDivElement = document.querySelector('.words__list');
    this.loadWords(wordsList, this.difficultyLevel, page);
  }

  render() {
    const component = document.createElement('div');
    component.className = 'textbook';

    component.append(
      this.createTitle(),
      this.createDifficultyLevels(),
      this.createDictionary(),
      this.createPagination(),
      this.createGamesList(),
    );

    return component;
  }
}
