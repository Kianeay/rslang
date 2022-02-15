import { GamesPreview, Footer } from '../../components';

export default class GamesPage {
  constructor() {}

  private createAudioBlock() {
    const audioText =
      'Check your listening skills, trying to pick the right meaning after hearing a word. Be careful, as you just have one guess.';
    const audioBlock = new GamesPreview({
      title: 'Audio challenge',
      text: audioText,
      imgName: 'listen.svg',
    }).render();

    return audioBlock;
  }

  private createSprintBlock() {
    const sprintText =
      'Check how much points you can get in one minute, making educated guesses about what is right and what is wrong.';
    const sprintBlock = new GamesPreview({
      title: 'Sprint',
      text: sprintText,
      imgName: 'sprint.svg',
      onClick: () => {
        location.hash = '#sprint';
      },
    }).render();

    return sprintBlock;
  }

  private createTitle(content: string) {
    const title = document.createElement('h2');
    title.className = 'games-wrap__title';
    title.textContent = content;

    return title;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'games-wrap';

    const games = document.createElement('div');
    games.className = 'games';

    const footer = new Footer().render();

    games.append(this.createAudioBlock(), this.createSprintBlock());

    component.append(this.createTitle('Minigames'), games, footer);

    return component;
  }
}
