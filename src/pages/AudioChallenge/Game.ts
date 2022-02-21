/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import {
  getWords,
  getUserWordsId,
  createUserWords,
  changeUserWord,
  getUserStatistics,
  changeUserStatistics,
} from '../../api/index';
import { IWord } from '../../types/index';
import SprintHeader from '../SprintGame/SprintHeader';

type AudioCall = {
  correctAnswer: number;
};

export type AudioCallWords = IWord & AudioCall;
export default class GameAudioCall {
  protected data: IWord[];

  protected arrayGame: AudioCallWords[];

  protected currentIndexWord: number;

  protected isAnswer: boolean;

  protected userId: string = localStorage.getItem('userID') || null;

  protected currentSeries: number;

  protected greatestSeries: number;

  protected learnedWord: number;

  protected correctArr = () => this.arrayGame.filter((item) => item.correctAnswer > 0);

  protected wrongArr = () => this.arrayGame.filter((item) => item.correctAnswer === 0);

  // protected learnedWords = () => this.arrayGame.filter((item) => item.correctAnswer >= 3).length;

  protected header: SprintHeader;

  protected score: number;

  protected scoreUpdate: number;

  constructor() {
    this.header = new SprintHeader(() => console.log(' '));
    this.data = [];
    this.arrayGame = [];
    this.currentIndexWord = -1;
    this.isAnswer = true;
    this.currentSeries = 0;
    this.greatestSeries = 0;
    this.score = 0;
    this.scoreUpdate = 10;
    this.learnedWord = 0;
  }

  protected async getWords(level: string) {
    this.data.length = 0;
    const arr = Array.from({ length: 30 }, (v, k) => k);
    const promisesArr = arr.map((item) => getWords(level, item.toString()));
    const promises = await Promise.all(promisesArr);
    promises.forEach((item) => this.data.push(...item));
  }

  protected async getWordsPage(page: string, group: string) {
    const arr = await getWords(group, page);
    this.data = [...arr];
  }

  protected async getArrayGamePage() {
    this.data.sort(() => Math.random() - 0.5);
    this.arrayGame = this.data.map((item) =>
      Object.assign(item, { correctAnswer: 0 }),
    );
  }

  protected async getArrayGame() {
    let arrNum = Array.from({ length: 20 }, () => this.getRandomNum(600));
    arrNum = [...this.checkArray(arrNum, 600)];
    this.arrayGame = arrNum.map((item) =>
      Object.assign(this.data[item], { correctAnswer: 0 }),
    );
  }

  protected getRandomNum(num: number) {
    return Math.floor(Math.random() * num);
  }

  protected checkArray(array: number[], max: number): number[] {
    const arr = [...array];
    for (let i = 0; i <= arr.length - 1; i += 1) {
      if (arr.indexOf(arr[i], i + 1) > 0) {
        arr[i] = this.getRandomNum(max);
        return this.checkArray(arr, max);
      }
    }

    return arr;
  }

  private playSound(type: boolean) {
    const audio = new Audio();
    if (type) {
      audio.src = 'src/assets/sounds/yes.mp3';
    } else {
      audio.src = 'src/assets/sounds/no.mp3';
    }
    audio.play();
  }

  protected changeButton() {
    const button = document.querySelector('.challenge__button');
    if (button !== null && this.isAnswer) {
      button.textContent = 'next word';
      // this.isAnswer = true;
    } else if (button !== null && !this.isAnswer) {
      button.textContent = 'I don\'t know';
      // this.isAnswer = false;
    }
  }

  protected async showAnswer() {
    if (this.currentIndexWord >= 0) {
      this.playSound(false);
      this.scoreUpdate = 10;
      const correctWord = this.arrayGame[this.currentIndexWord].wordTranslate;
      const answers = document.querySelectorAll(
        '.challenge__answer',
      ) as NodeListOf<HTMLElement>; // eslint-disable-line no-undef
      let correct: HTMLElement;
      answers.forEach((item) => {
        if (correctWord === item.textContent.split('.')[1].trim()) {
          correct = item;
        }
      });
      correct.classList.add('challenge__correct-answer');
      if (this.userId) {
        await this.createWordStat(false);
      }
    }
  }

  protected async checkAnswer(element: HTMLDivElement) {
    this.isAnswer = true;
    if (element !== null) {
      const word = element.textContent.split('.')[1].trim();
      const correctWord = this.arrayGame[this.currentIndexWord].wordTranslate;
      if (correctWord === word) {
        this.currentSeries += 1;
        if (this.currentSeries > this.greatestSeries) {
          this.greatestSeries = this.currentSeries;
        }
        this.playSound(true);
        this.changeButton();
        this.updateScore();
        this.arrayGame[this.currentIndexWord].correctAnswer += 1;
        element.classList.add('challenge__correct-answer');
        if (this.userId) {
          await this.createWordStat(true);
        }
      } else {
        this.currentSeries = 0;
        element.classList.add('challenge__incorrect-answer');
        this.arrayGame[this.currentIndexWord].correctAnswer = 0;
        this.scoreUpdate = 10;
        this.updateScorePlus();
        this.changeButton();
        await this.showAnswer();
      }
    }
  }

  private updateScore() {
    if (this.currentSeries >= 3 && this.currentSeries <= 5) {
      this.score += 20;
      this.scoreUpdate = 20;
    } else if (this.currentSeries >= 6) {
      this.score += 30;
      this.scoreUpdate = 30;
    } else {
      this.score += 10;
      this.scoreUpdate = 10;
    }
    const score = document.querySelector('.sprint__score-count');
    score.textContent = `${this.score}`;
  }

  protected updateScorePlus() {
    const scoreUpdate = document.querySelector('.sprint__plus-score');
    scoreUpdate.textContent = `+${this.scoreUpdate}`;
  }

  protected playAudio() {
    const buttonPlay = document.querySelector(
      '.challenge__play-audio',
    ) as HTMLButtonElement;
    const src = this.arrayGame[this.currentIndexWord].audio;
    const audio = new Audio();
    audio.src = `https://react-learnwords2022.herokuapp.com/${src}`;
    audio.addEventListener('canplay', () => {
      audio.play();
      buttonPlay.disabled = true;
    });
    audio.addEventListener('ended', () => {
      buttonPlay.disabled = false;
    });
  }

  // статистика по конкретному слову
  private async createWordStat(correct: boolean) {
    // есть ли уже статистика по слову
    const word = await getUserWordsId(
      this.userId,
      this.arrayGame[this.currentIndexWord].id,
    );
    // если на слово праавильно ответили
    if (correct) {
      if (!word) {
        await createUserWords(
          this.userId,
          this.arrayGame[this.currentIndexWord].id,
          {
            difficulty: 'easy',
            optional: {
              status: 'simple',
              new: true,

              sprint: {
                correctAnswers: 0,
              },

              audio: {
                correctAnswers: 1,
              },
            },
          },
        );
      } else if (
        word.optional.sprint.correctAnswers +
          word.optional.audio.correctAnswers >
        2
      ) {
        if (word.optional.audio.correctAnswers === 2) {
          this.learnedWord += 1;
        }
        await changeUserWord(
          this.userId,
          this.arrayGame[this.currentIndexWord].id,
          {
            difficulty: 'weak',
            optional: {
              status: 'learned',
              sprint: {
                correctAnswers: word.optional.sprint.correctAnswers,
              },
              audio: {
                correctAnswers: (word.optional.audio.correctAnswers += 1),
              },
            },
          },
        );
      } else {
        await changeUserWord(
          this.userId,
          this.arrayGame[this.currentIndexWord].id,
          {
            difficulty: 'weak',
            optional: {
              new: true,
              sprint: {
                correctAnswers: word.optional.sprint.correctAnswers,
              },
              audio: {
                correctAnswers: word.optional.audio
                  ? (word.optional.audio.correctAnswers += 1)
                  : 1,
              },
            },
          },
        );
      }
    } else if (!word) {
      await createUserWords(
        this.userId,
        this.arrayGame[this.currentIndexWord].id,
        {
          difficulty: 'easy',
          optional: {
            status: 'simple',
            new: true,

            sprint: {
              correctAnswers: 0,
            },

            audio: {
              correctAnswers: 0,
            },
          },
        },
      );
    }
  }

  // статистика общая
  protected async addStatistics() {
    const statistics = await getUserStatistics(this.userId);

    if (statistics) {
      await changeUserStatistics(this.userId, {
        optional: {
          new: 0,

          sprint: {
            learned: statistics.optional.sprint.learned,
            correctAnswers: statistics.optional.sprint.correctAnswers,
            count: statistics.optional.sprint.count,
            row: statistics.optional.sprint.row,
          },

          audio: {
            learned: statistics.optional.audio.learned + this.learnedWord,
            correctAnswers:
              statistics.optional.audio.correctAnswers +
              this.correctArr().length,
            count:
              statistics.optional.audio.count +
              this.correctArr().length +
              this.wrongArr().length,
            row: (this.greatestSeries > statistics.optional.audio.row) ?
              this.greatestSeries : statistics.optional.audio.row,
          },
        },
      });
    } else {
      await changeUserStatistics(this.userId, {
        optional: {
          new: 0,

          sprint: {
            learned: 0,
            correctAnswers: 0,
            count: 0,
            row: 0,
          },

          audio: {
            learned: this.learnedWord,
            correctAnswers: this.correctArr().length,
            count: 20,
            row: this.greatestSeries,
          },
        },
      });
    }
  }
}
