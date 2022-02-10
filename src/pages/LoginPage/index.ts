/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

import { Button, Input } from '../../components';
import { createUser, signIn, getUser } from '../../api/index';

export default class LoginPage {
  private logoutNav: HTMLButtonElement;

  private logoutNavImage: HTMLButtonElement;

  private logIn: boolean;

  constructor() {
    this.logoutNav = document.querySelector('.nav__logout');
    this.logoutNavImage = document.querySelector('.nav__logout-wrap');
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
        this.changeButtons(true);
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
    if (this.logIn) {
      logInBtn.classList.add('scaleLessBtn');
    }

    return logInBtn;
  }

  private createSignUpBtn() {
    const lSignUpBtn = new Button({
      label: 'Sign Up',
      onClick: this.signUpUser.bind(this),
    }).render();
    lSignUpBtn.classList.add('form__signup-btn');
    if (this.logIn) {
      lSignUpBtn.classList.add('scaleLessBtn');
    }

    return lSignUpBtn;
  }

  private createLogOutBtn() {
    const logOutBtn = new Button({
      label: 'Log Out',
      onClick: this.logOutUser.bind(this),
    }).render();
    logOutBtn.classList.add('form__logout-btn');
    if (this.logIn) {
      logOutBtn.classList.add('scaleLargeBtn');
    }

    return logOutBtn;
  }

  async signUpUser() {
    const isCheck = this.checkInput();
    if (isCheck) {
      const create = await createUser({ ...isCheck });
      if (create) {
        const login = await signIn({ ...isCheck });
        if (login) {
          this.getUser();
        }
      }
    }
  }

  async logInUser() {
    const isCheck = this.checkInput();
    if (isCheck) {
      const login = await signIn({ ...isCheck });
      if (login) {
        this.getUser();
      }
    }
  }

  private createPasswordInput() {
    const passwordInput = new Input({
      type: 'password',
      onChange: this.validatePassword,
    }).render();
    passwordInput.className = 'form__password';

    return passwordInput;
  }

  private createEmailInput() {
    const emailInput = new Input({
      type: 'text',
      onChange: this.validateEmail,
    }).render();
    emailInput.className = 'form__email';
    emailInput.focus();

    return emailInput;
  }

  checkInput() {
    const emailElem = document.querySelector('.form__email') as HTMLInputElement;
    const passwordElem = document.querySelector('.form__password') as HTMLInputElement;
    const email = emailElem.value;
    const password = passwordElem.value;
    if (email.length === 0) {
      console.log('email invalid');
    }
    if (password.length === 0) {
      console.log('password invalid');
    }
    if (emailElem.classList.contains('_valid-input') && passwordElem.classList.contains('_valid-input')) {
      emailElem.classList.remove('_valid-input');
      passwordElem.classList.remove('_valid-input');
      return { email, password };
    }

    return false;
  }

  logOutUser() {
    this.logIn = false;
    this.changeButtons(false);
    localStorage.removeItem('userID');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  changeButtons(logIn: boolean) {
    const loginBtn = document.querySelector('.form__login-btn');
    const sighUpBtn = document.querySelector('.form__signup-btn');
    const logOut = document.querySelector('.form__logout-btn');
    if (loginBtn !== null && sighUpBtn !== null && logOut !== null) {
      loginBtn.classList.toggle('scaleLessBtn');
      sighUpBtn.classList.toggle('scaleLessBtn');
      logOut.classList.toggle('scaleLargeBtn');
    }
    this.logoutNav.classList.toggle('visibility');
    this.logoutNavImage.classList.toggle('visibility');
  }

  clearInput() {
    const emailElem = document.querySelector('.form__email') as HTMLInputElement;
    const passwordElem = document.querySelector('.form__password') as HTMLInputElement;
    if (emailElem !== null && passwordElem !== null) {
      emailElem.value = '';
      passwordElem.value = '';
    }
  }

  validateEmail(event: Event) {
    const emailElem = event.currentTarget as HTMLInputElement;
    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailElem.value.match(validEmail)) {
      console.log('invalid email');
    } else {
      emailElem.classList.add('_valid-input');
    }
  }

  validatePassword(event: Event) {
    const passwordElem = event.currentTarget as HTMLInputElement;
    if (passwordElem.value.length < 8) {
      console.log('invalid password');
    } else {
      passwordElem.classList.add('_valid-input');
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

  private createButtonsContainer() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'form__buttons-container';
    buttonsContainer.append(
      this.createLogInBtn(),
      this.createSignUpBtn(),
      this.createLogOutBtn(),
    );

    return buttonsContainer;
  }

  private createInputContainer(input: HTMLInputElement, label: HTMLDivElement) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'form__input-container';
    inputContainer.append(input, label);

    return inputContainer;
  }

  createTitle() {
    const title = document.createElement('p');
    title.className = 'form__title';
    title.textContent = 'RS Lang';

    return title;
  }

  private createForm() {
    const form = document.createElement('div');
    form.className = 'form';
    form.append(
      this.createTitle(),
      this.createInputContainer(
        this.createEmailInput(),
        this.createLabel('Enter your email', 'form__label-email'),
      ),
      this.createInputContainer(
        this.createPasswordInput(),
        this.createLabel('Enter password', 'form__label-password'),
      ),
      this.createButtonsContainer(),
    );

    return form;
  }

  render() {
    const component = document.createElement('div');
    component.className = 'form-container';
    component.append(this.createForm());
    return component;
  }
}
