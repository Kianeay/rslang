import { Button, Footer } from '../../components';
import { getUserStatistics, OptionalObjStat } from '../../api';

export default class StatisticsPage {
  private userStat: { optional: OptionalObjStat };

  private userId: string = localStorage.getItem('userID');

  constructor() {}

  private createTitle(content: string) {
    const title = document.createElement('h2');
    title.className = 'statistics__title';
    title.textContent = content;

    return title;
  }

  private createLoginBtn() {
    const loginBtn = new Button({
      label: 'Log in',
      onClick: () => {
        location.hash = '#login';
      },
    }).render();
    loginBtn.classList.add('main__login');

    return loginBtn;
  }

  private createStatBlock(num: string, label: string) {
    const wrap = document.createElement('div');
    wrap.className = 'statistics__block';

    const number = document.createElement('span');
    number.className = 'statistics__stat';
    number.textContent = num;

    const text = document.createElement('span');
    text.className = 'statistics__text';
    text.textContent = label;

    wrap.append(number, text);

    return wrap;
  }

  private createMain() {
    const component = document.createElement('div');
    component.className = 'statistics__main';

    const subtitle = document.createElement('p');
    subtitle.className = 'statistics__subtitle';
    subtitle.textContent = 'Today';

    const generalWrap = document.createElement('div');
    generalWrap.className = 'statistics__general';

    const learnedNum = `${
      this.userStat.optional.sprint.learned +
      this.userStat.optional.audio.learned
    }`;

    const learned = this.createStatBlock(learnedNum, 'Learned words');
    learned.classList.add('statistics__stat-big');

    const accuracyNum = `${Math.round(
      ((this.userStat.optional.sprint.correctAnswers +
        this.userStat.optional.audio.correctAnswers) /
        (this.userStat.optional.sprint.count +
          this.userStat.optional.audio.count)) *
        100,
    )}%`;

    const accuracy = this.createStatBlock(accuracyNum, 'Accuracy');
    accuracy.classList.add('statistics__stat-big');

    generalWrap.append(learned, accuracy);

    const gamesWrap = document.createElement('div');
    gamesWrap.className = 'statistics__games';

    gamesWrap.append(
      this.createGameBlock('Audio challenge', 'audio'),
      this.createGameBlock('Sprint', 'sprint'),
    );

    component.append(subtitle, generalWrap, gamesWrap);

    return component;
  }

  private createGameBlock(label: string, game: string) {
    const component = document.createElement('div');
    component.className = 'statistics__game';

    const title = document.createElement('p');
    title.className = 'statistics__game__title';
    title.textContent = label;

    const statWrap = document.createElement('div');
    statWrap.className = 'statistics__game-wrap';

    if (game === 'sprint') {
      statWrap.append(
        this.createStatBlock(
          `${this.userStat.optional.sprint.learned || 0}`,
          'Learned words',
        ),
        this.createStatBlock(
          `${
            Math.round(
              (this.userStat.optional.sprint.correctAnswers /
                this.userStat.optional.sprint.count) *
                100,
            ) || 0
          }%`,
          'Accuracy',
        ),
        this.createStatBlock(
          `${this.userStat.optional.sprint.row || 0}`,
          'In a row',
        ),
      );
    } else {
      statWrap.append(
        this.createStatBlock(
          `${this.userStat.optional.audio.learned || 0}`,
          'Learned words',
        ),
        this.createStatBlock(
          `${
            Math.round(
              (this.userStat.optional.audio.correctAnswers /
                this.userStat.optional.audio.count) *
                100,
            ) || 0
          }%`,
          'Accuracy',
        ),
        this.createStatBlock(
          `${this.userStat.optional.audio.row || 0}`,
          'In a row',
        ),
      );
    }

    component.append(title, statWrap);

    return component;
  }

  private async getStatistics() {
    this.userStat = await getUserStatistics(this.userId);
  }

  render() {
    const component = document.createElement('div');
    component.className = 'statistics';
    const footer = new Footer().render();

    this.getStatistics().then(() => {
      component.append(
        this.createTitle('Statistics'),
        this.createMain(),
        footer,
      );
    });

    if (!localStorage.getItem('userID')) {
      component.append(this.createLoginBtn());
    }

    return component;
  }
}
