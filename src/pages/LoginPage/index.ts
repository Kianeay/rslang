import { Button, Input } from '../../components';
import { createUser, signIn, getUser } from '../../api/index';

export default class LoginPage {
  private logoutNav: HTMLButtonElement;

  private logoutNavImage: HTMLButtonElement;

  private getEmailInput: () => HTMLInputElement;

  private getPasswordInput: () => HTMLInputElement;

  private getNamedInput: () => HTMLInputElement;

  private getLoginBtn: () => HTMLButtonElement;

  private getSignupBtn: () => HTMLButtonElement;

  private getLogOutBtn: () => HTMLButtonElement;

  private getEmailMessage: () => HTMLSpanElement;

  private getPasswordMessage: () => HTMLSpanElement;

  private getErrorMessage: () => HTMLSpanElement;

  public logIn: boolean;

  constructor() {
    this.logoutNav = document.querySelector('.nav__logout');
    this.logoutNavImage = document.querySelector('.nav__logout-wrap');
    this.getEmailInput = () => document.querySelector('.form__email');
    this.getPasswordInput = () => document.querySelector('.form__password');
    this.getNamedInput = () => document.querySelector('.form__user-name');
    this.getLoginBtn = () => document.querySelector('.form__login-btn');
    this.getSignupBtn = () => document.querySelector('.form__signup-btn');
    this.getLogOutBtn = () => document.querySelector('.form__logout-btn');
    this.getEmailMessage = () => document.querySelector('.form__invalid-email');
    this.getPasswordMessage = () => document.querySelector('.form__invalid-password');
    this.getErrorMessage = () => document.querySelector('.form__invalid__answer');
    this.logIn = false;

    this.logoutNav.addEventListener('click', this.logOutUser.bind(this));
    this.logoutNavImage.addEventListener('click', this.logOutUser.bind(this));
  }

  async getUser() {
    const id = localStorage.getItem('userID');
    const token = localStorage.getItem('refreshToken');
    if (id && token) {
      const user = await getUser(localStorage.getItem('userID'));
      if (user) {
        this.clearInput();
        this.changeButtons();
        this.logIn = true;
      }
    }
  }

  private createLogInBtn() {
    const logInBtn = new Button({
      label: 'Log In',
      onClick: this.logInUser.bind(this),
    }).render();
    logInBtn.classList.add('form__login-btn');
    logInBtn.classList.add('button_colored');
    if (this.logIn) {
      logInBtn.classList.add('form__login-btn_scale-down');
    }

    return logInBtn;
  }

  private createSignUpBtn() {
    const lSignUpBtn = new Button({
      label: 'Sign Up',
      onClick: this.signUpUser.bind(this),
    }).render();
    lSignUpBtn.classList.add('form__signup-btn');
    lSignUpBtn.classList.add('button_colored');
    lSignUpBtn.classList.add('none');
    if (this.logIn) {
      lSignUpBtn.classList.add('form__signup-btn_scale-down');
    }

    return lSignUpBtn;
  }

  private createLogOutBtn() {
    const logOutBtn = new Button({
      label: 'Log Out',
      onClick: this.logOutUser.bind(this),
    }).render();
    logOutBtn.classList.add('form__logout-btn');
    logOutBtn.classList.add('button_colored');
    if (this.logIn) {
      logOutBtn.classList.add('form__logout-btn_scale-up');
    }

    return logOutBtn;
  }

  async signUpUser() {
    const isCheck = this.checkInput();
    const error = this.getErrorMessage();
    if (isCheck) {
      const create = await createUser({ ...isCheck }, () => {
        error.classList.remove('none');
        error.textContent = 'User has been created';
      });
      if (create) {
        this.logInUser();
      }
    }
  }

  async logInUser() {
    const isCheck = this.checkInput();
    const error = this.getErrorMessage();
    if (isCheck) {
      const login = await signIn(
        { ...isCheck },
        () => {
          error.classList.remove('none');
          error.textContent = 'Incorrect email or password';
        },
        () => {
          error.classList.remove('none');
          error.textContent = 'User wasn\'t found';
        },
      );
      if (login) {
        this.getUser();
      }
    }
  }

  private createNamedInput() {
    const nameInput = new Input({
      type: 'text',
    }).render();
    nameInput.className = 'form__user-name none';
    nameInput.required = true;

    return nameInput;
  }

  private createPasswordInput() {
    const passwordInput = new Input({
      type: 'password',
      onChange: this.validatePassword.bind(this),
    }).render();
    passwordInput.className = 'form__password';
    passwordInput.required = true;

    return passwordInput;
  }

  private createEmailInput() {
    const emailInput = new Input({
      type: 'text',
      onChange: this.validateEmail.bind(this),
    }).render();
    emailInput.className = 'form__email';
    emailInput.required = true;

    return emailInput;
  }

  checkInput() {
    const emailElem = this.getEmailInput();
    const passwordElem = this.getPasswordInput();
    const userNameElem = this.getNamedInput();
    const email = emailElem.value;
    const password = passwordElem.value;
    const name = userNameElem.value;
    if (!email.length) {
      emailElem.classList.add('form__email_invalid');
      this.getEmailMessage().classList.remove('none');
    }
    if (!email.length) {
      passwordElem.classList.add('form__password_invalid');
      this.getPasswordMessage().classList.remove('none');
    }
    if (!emailElem.classList.contains('form__email_invalid') &&
    !passwordElem.classList.contains('form__password_invalid')) {
      return (name) ? { name, email, password } : { email, password };
    }

    return false;
  }

  logOutUser() {
    this.logIn = false;
    this.changeButtons();
    localStorage.removeItem('userID');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  changeButtons() {
    const loginBtn = this.getLoginBtn();
    const sighUpBtn = this.getSignupBtn();
    const logOutBtn = this.getLogOutBtn();
    if (loginBtn !== null && sighUpBtn !== null && logOutBtn !== null) {
      loginBtn.classList.toggle('form__login-btn_scale-down');
      sighUpBtn.classList.toggle('form__signup-btn_scale-down');
      logOutBtn.classList.toggle('form__logout-btn_scale-up');
    }
    this.logoutNav.classList.toggle('hidden');
    this.logoutNavImage.classList.toggle('hidden');
  }

  clearInput() {
    const emailElem = this.getEmailInput();
    const passwordElem = this.getPasswordInput();
    const nameElem = this.getNamedInput();
    if (emailElem !== null && passwordElem !== null) {
      emailElem.value = '';
      passwordElem.value = '';
    }
    if (nameElem !== null) {
      nameElem.value = '';
    }
  }

  validateEmail(event: Event) {
    const emailElem = event.currentTarget as HTMLInputElement;
    const message = this.getEmailMessage();
    this.getErrorMessage().classList.add('none');
    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailElem.value.match(validEmail)) {
      message.classList.remove('none');
      emailElem.classList.add('form__email_invalid');
    } else {
      emailElem.classList.remove('form__email_invalid');
      message.classList.add('none');
    }
  }

  validatePassword(event: Event) {
    const passwordElem = event.currentTarget as HTMLInputElement;
    const message = this.getPasswordMessage();
    this.getErrorMessage().classList.add('none');
    if (passwordElem.value.length < 8) {
      passwordElem.classList.add('form__password_invalid');
      message.classList.remove('none');
    } else {
      passwordElem.classList.remove('form__password_invalid');
      message.classList.add('none');
    }
  }

  private createLabel(text: string, classDiv: string) {
    const labelWrap = document.createElement('div');
    const label = document.createElement('label');
    labelWrap.className = `form__label-box ${classDiv}`;
    label.textContent = text;

    labelWrap.append(label);

    return labelWrap;
  }

  private createLink(text: string, classLink: string) {
    const link = document.createElement('span');
    link.className = `form__link ${classLink}`;
    link.addEventListener('click', this.signInRender.bind(this));
    link.textContent = text;

    return link;
  }

  private signInRender() {
    const signInLink = document.querySelector('.form__to-signup');
    const logInLink = document.querySelector('.form__to-login');
    const labelName = document.querySelector('.form__label-name');
    const name = this.getNamedInput();
    signInLink.classList.toggle('none');
    logInLink.classList.toggle('none');
    this.getSignupBtn().classList.toggle('none');
    name.classList.toggle('none');
    labelName.classList.toggle('none');
    this.getLoginBtn().classList.toggle('hidden');
  }

  private createButtonsContainer() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'form__buttons-container';

    buttonsContainer.append(
      this.createInvalidMessage('', 'form__invalid__answer'),
      this.createLogInBtn(),
      this.createLink('create account', 'form__to-signup'),
      this.createSignUpBtn(),
      this.createLink('back', 'form__to-login none'),
      this.createLogOutBtn(),
    );

    return buttonsContainer;
  }

  private createInputContainer(
    input: HTMLInputElement,
    label: HTMLDivElement,
    message: HTMLSpanElement,
  ) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'form__input-container';

    inputContainer.append(input, label, message);

    return inputContainer;
  }

  createTitle() {
    const title = document.createElement('p');
    title.className = 'form__title';
    title.textContent = 'RS Lang';

    return title;
  }

  private createLoginBackground() {
    const loginImg = document.createElement('img');
    loginImg.className = 'form__img';
    loginImg.src = 'src/assets/images/main.svg';

    return loginImg;
  }

  createInvalidMessage(text: string, classElem: string) {
    const message = document.createElement('span');
    message.className = `form__invalid-text none ${classElem}`;
    message.textContent = text;

    return message;
  }

  private createForm() {
    const form = document.createElement('div');
    form.className = 'form';

    form.append(
      this.createTitle(),
      this.createInputContainer(
        this.createNamedInput(),
        this.createLabel('Enter your name', 'form__label-name none'),
        this.createInvalidMessage('incorrect name', 'form__invalid-name'),
      ),
      this.createInputContainer(
        this.createEmailInput(),
        this.createLabel('Enter your email', 'form__label-email'),
        this.createInvalidMessage('incorrect email', 'form__invalid-email'),
      ),
      this.createInputContainer(
        this.createPasswordInput(),
        this.createLabel('Enter password', 'form__label-password'),
        this.createInvalidMessage('short password, min length 8 characters', 'form__invalid-password'),
      ),
      this.createButtonsContainer(),
    );

    return form;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'form-container';

    component.append(
      this.createForm(),
      this.createLoginBackground(),
    );

    return component;
  }
}
