import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationController, ValidationRules, validateTrigger } from 'aurelia-validation';

import { AuthenticateService } from "./authenticate-service";
import { ILogin } from 'stores/data-store';
import { EventsStore } from 'stores/events-store';
import { EVENTS } from 'stores/events';
import { ICONS } from 'resources/constants/icons';

import './login.scss';

@autoinject()
export class Login {
  public icons = ICONS;
  public identity: string;
  public password: string;
  public passwordConfirm: string;
  public submitted: boolean = false;
  public error: string;

  private validation: ValidationController;
  private fromRoute: string;
  public registerEnabled: boolean;
  public viewPassword: boolean;

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService,
    private eventsStore: EventsStore,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }

  public activate(params: { from: string }): void {
    this.fromRoute = params.from;
    this.setupValidations();
    document.addEventListener('keydown', this.handleKeyPress);
  }

  private setupValidations(): void {
    ValidationRules.ensure('identity')
      .required()
      .withMessage('Please enter your username.')
      .ensure('password')
      .required()
      .withMessage('Please enter your password.')
      .on(this);
  }

  public handleKeyPress = (event: KeyboardEvent): void => {
    if (event.ctrlKey && event.altKey && event.key === 'r') {
      console.log(' ::>> enable register state ');
      this.enableRegister();
    }
  }

  private enableRegister(): void {
    this.registerEnabled = true;
  }

  public disableRegister(): void {
    this.registerEnabled = false;
  }

  public startHold(): void {
    this.viewPassword = true;
  }

  public endHold(): void {
    this.viewPassword = false;
  }

  public clearErrors(): void {
    this.error = null;
  }

  public goBack(): void {
    this.router.navigate('');
  }

  public register(): void {
    if (this.submitted) return;
    this.error = null;

    this.validation
      .validate()
      .then(validation => {
        if (!validation.valid) {
          console.log(' ::>> is invalid ', validation);
          this.submitted = false;
          return;
        }
        if (this.password !== this.passwordConfirm) {
          return;
        }
        this.triggerRegister();
      })
      .catch(() => {
        this.submitted = false;
        this.error = 'Email or password is incorrect. Please try again.';
      });
  }

  private triggerRegister(): void {
    this.authenticateService
      .registerUser(this.identity, this.password)
      .then(user => {
        console.log(' ::>> user => ', user);
      })
      .catch(error => {
        this.error = error;
      });
  }

  public login(): void {
    if (this.submitted) return;
    this.error = null;
    this.submitted = true;

    this.validation
      .validate()
      .then(validation => {
        if (!validation.valid) {
          console.log(' ::>> is invalid ', validation);
          this.submitted = false;
          return;
        }
        this.triggerLogin();
      })
      .catch(() => {
        this.submitted = false;
        this.error = 'Email or password is incorrect. Please try again.';
      });
  }

  private triggerLogin(): void {
    this.authenticateService
      .authenticate(this.identity, this.password)
      .then(user => this.handleUserAuthenticated({ username: this.identity }))
      .catch(error => {
        this.error = error;
        this.submitted = false;
      });
  }

  private handleUserAuthenticated(user: any): void {
    console.log(' ::>> handleUserAuthenticated >>>> ', user);
    this.eventsStore
      .subscribeAndPublish(
        EVENTS.USER_LOGGED_IN,
        EVENTS.USER_UPDATED,
        user,
        () => {
          this.router.navigate('auth/studio');
        }
      );
  }

  public deactivate(): void {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
}
