import SprintGame from '.';

export default class SprintHeader {
  private timeCount = 30;

  private timeElem: Element;

  private scoreCount = 0;

  private scoreElem: Element;

  private plusScoreCount = 10;

  private plusScoreElem: Element;

  constructor(private stop: () => void) {
    this.stop = stop;
  }

  private createTimer() {
    const timeWrap = document.createElement('div');
    timeWrap.className = 'sprint__time-wrap';

    const time = document.createElement('span');
    time.className = 'sprint__time';
    time.textContent = 'time:';

    const timeCount = document.createElement('span');
    timeCount.className = 'sprint__time-count';
    timeCount.textContent = '30';
    this.timeElem = timeCount;

    timeWrap.append(time, timeCount);

    return timeWrap;
  }

  private createScore() {
    const scoreWrap = document.createElement('div');
    scoreWrap.className = 'sprint__score-wrap';

    const score = document.createElement('span');
    score.className = 'sprint__score';
    score.textContent = 'score:';

    const scoreCount = document.createElement('span');
    scoreCount.className = 'sprint__score-count';
    scoreCount.textContent = '0';
    this.scoreElem = scoreCount;

    scoreWrap.append(score, scoreCount);

    return scoreWrap;
  }

  setTimer() {
    const start = () => {
      this.timeElem.textContent = `${+this.timeElem.textContent - 1}`;
      if (+this.timeElem.textContent === 0) {
        this.stop();
      }
    };

    setInterval(start, 1000);
  }

  updateScore() {
    this.scoreElem.textContent = `${+this.scoreElem.textContent + 10}`;
  }

  render() {
    const header = document.createElement('div');
    header.className = 'sprint__header';

    const plusScore = document.createElement('p');
    plusScore.className = 'sprint__plus-score';
    plusScore.textContent = '+10';
    this.plusScoreElem = plusScore;

    header.append(this.createTimer(), plusScore, this.createScore());

    return header;
  }
}
