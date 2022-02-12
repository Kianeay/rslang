import { GamesPreview } from '../../components';

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
    }).render();

    return sprintBlock;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'games';

    component.append(this.createAudioBlock(), this.createSprintBlock());

    return component;
  }
}
