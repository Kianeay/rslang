import {
  getWords,
  getUserWordsId,
  createUserWords,
  changeUserWord,
  getUserStatistics,
  changeUserStatistics,
} from '../../api/index';
import { IWord } from '../../types/index';

type AudioCall = {
  correctAnswer: number;
}

export type AudioCallWords = IWord & AudioCall;
export default class GameAudioCall {
  protected data: IWord[];

  protected arrayGame: AudioCallWords[];

  protected currentIndexWord: number;

  protected isAnswer: boolean;

  private userId: string = localStorage.getItem('userID') || null;

  constructor() {
    this.data = [];
    this.arrayGame = [];
    this.currentIndexWord = -1;
    this.isAnswer = true;
  }

  protected async getWords(level: string) {
    this.data.length = 0;
    const arr = Array.from({ length: 30 }, (v, k) => k);
    const promisesArr = arr.map((item) => getWords(level, item.toString()));
    const promises = await Promise.all(promisesArr);
    promises.forEach((item) => this.data.push(...item));
  }

  private getDate() {
    const data = new Date();

    return `${data.getDate()}.${data.getMonth()}.${data.getFullYear()}`;
  }

  protected async getArrayGame() {
    let arrNum = Array.from({ length: 20 }, () => this.getRandomNum(600));
    arrNum = [...this.checkArray(arrNum, 600)];
    this.arrayGame = arrNum.map((item) => Object.assign(this.data[item], { correctAnswer: 0 }));
  }

  protected getRandomNum(num: number) {
    return Math.floor(Math.random() * num);
  }

  protected checkArray(array: number[], max: number):number[] {
    const arr = [...array];
    for (let i = 0; i <= arr.length - 1; i += 1) {
      if (arr.indexOf(arr[i], i + 1) > 0) {
        arr[i] = this.getRandomNum(max);
        return this.checkArray(arr, max);
      }
    }

    return arr;
  }

  private changeButton() {
    const button = document.querySelector('.challenge__button');
    if (button !== null) {
      button.textContent = 'next word';
      this.isAnswer = true;
    }
  }

  protected showAnswer() {
    if (this.currentIndexWord >= 0) {
      const correctWord = this.arrayGame[this.currentIndexWord].wordTranslate;
      const answers = document.querySelectorAll('.challenge__answer') as NodeListOf<HTMLElement>; // eslint-disable-line no-undef
      let correct: HTMLElement;
      answers.forEach((item) => {
        if (correctWord === item.textContent.split('.')[1].trim()) {
          correct = item;
        }
      });
      this.changeButton();
      correct.classList.add('challenge__correct-answer');
    }
  }

  protected checkAnswer(element: HTMLDivElement) {
    const word = element.textContent.split('.')[1].trim();
    const correctWord = this.arrayGame[this.currentIndexWord].wordTranslate;
    if (correctWord === word) {
      this.changeButton();
      this.arrayGame[this.currentIndexWord].correctAnswer += 1;
      element.classList.add('challenge__correct-answer');
    } else {
      element.classList.add('challenge__incorrect-answer');
      this.showAnswer();
    }
  }

  protected playAudio() {
    const buttonPlay = document.querySelector('.challenge__play-audio') as HTMLButtonElement;
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
                correctAnswers: 1,
              },

              audio: {
                correctAnswers: 0,
              },
            },
          },
        );
      } else if (
        word.optional.sprint.correctAnswers +
          word.optional.audio.correctAnswers >
        2
      ) {
        await changeUserWord(
          this.userId,
          this.arrayGame[this.currentIndexWord].id,
          {
            difficulty: 'weak',
            optional: {
              status: 'learned',

              sprint: {
                correctAnswers: (word.optional.sprint.correctAnswers += 1),
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
                correctAnswers: word.optional.sprint
                  ? (word.optional.sprint.correctAnswers += 1)
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
  private async addStatistics() {
    const word = await getUserWordsId(
      this.userId,
      this.arrayGame[this.currentIndexWord].id,
    );

    const statistics = await getUserStatistics(this.userId);

    if (!word) {
      if (statistics) {
        await changeUserStatistics(this.userId, {
          optional: {
            new: (statistics.optional.new += 1),

            sprint: {
              learned: 10,
              correctAnswers: 12,
              count: 100,
            },

            audio: {
              learned: 10,
              correctAnswers: 10,
              count: 100,
            },
          },
        });
      } else {
        await changeUserStatistics(this.userId, {
          optional: {
            new: 50,

            sprint: {
              learned: 10,
              correctAnswers: 12,
              count: 100,
            },

            audio: {
              learned: 10,
              correctAnswers: 10,
              count: 100,
            },
          },
        });
      }
    }

    // console.log(await getUserStatistics(this.userId));
  }
}
