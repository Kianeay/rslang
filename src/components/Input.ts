interface InputProps {
  type: string;
  onChange?: (event?: Event) => void;
}

export default class Input {
  private readonly type: string = 'text';

  private readonly onChange: (event?: Event) => void;

  constructor(props: InputProps) {
    this.type = props.type;
    this.onChange = props.onChange;
  }

  render() {
    const component = document.createElement('input');
    component.type = this.type;
    component.className = 'input';

    if (this.onChange) {
      component.addEventListener('change', this.onChange.bind(this));
    }

    return component;
  }
}
