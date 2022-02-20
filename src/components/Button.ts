interface ButtonProps {
  label: string;
  onClick?: (event?: Event) => void;
}

export default class Button {
  private readonly label: string = '';

  private readonly onClick: (event?: Event) => void;

  constructor(props: ButtonProps) {
    this.label = props.label;

    this.onClick = props.onClick;
  }

  render() {
    const component = document.createElement('button');
    component.textContent = this.label;
    component.className = 'button';

    if (this.onClick) {
      component.addEventListener('click', this.onClick.bind(this));
    }

    return component;
  }
}
