export default class DifficultyLevel {
  private difficultyLevelsCount = 6;

  private callback: (level: string) => void;

  constructor(callback: (level: string) => void) {
    this.callback = callback;
  }

  private changeActiveDifficultyLevel(element: HTMLElement) {
    const parent = element.parentElement;

    Array.from(parent.children).forEach((child) => {
      child.classList.remove('difficulty__item-active');
    });

    element.classList.add('difficulty__item-active');
  }

  private createTitle() {
    const title = document.createElement('h3');
    title.textContent = 'Vocabulary difficulty level';
    title.className = 'difficulty__title';

    return title;
  }

  private creadteDifficultyList() {
    const difficultyList = document.createElement('ul');
    difficultyList.className = 'difficulty__list';
    for (let i = 0; i < this.difficultyLevelsCount; i += 1) {
      const difficultyItem = document.createElement('li');
      difficultyItem.className = 'difficulty__item';
      difficultyItem.textContent = String(i);
      difficultyItem.setAttribute('data-num', String(i));

      if (i === 0) {
        difficultyItem.classList.add('difficulty__item-active');
      }

      difficultyList.append(difficultyItem);
    }
    return difficultyList;
  }

  render() {
    const difficultyLevels = document.createElement('div');
    difficultyLevels.className = 'difficulty';

    difficultyLevels.append(
      this.createTitle(),
      this.creadteDifficultyList(),
    );

    difficultyLevels.addEventListener('click', (event: Event) => {
      const { target } = event;

      if ((target as HTMLElement).classList.contains('difficulty__item')) {
        this.changeActiveDifficultyLevel(target as HTMLElement);
        const currentLevel = (target as HTMLElement).dataset.num;
        this.callback(currentLevel);
      }
    });

    return difficultyLevels;
  }
}
