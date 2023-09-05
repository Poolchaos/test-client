import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { HttpClient } from 'aurelia-http-client';

import { v4 as uuidv4 } from 'uuid';

import { STEP_CONSTANTS } from '../../../../views/test-creator/steps/step-constants';
import { PREDEFINED_STEP_CONFIG } from './predefined-config';
import { ICONS } from '../../../constants/icons';

import './add-step-dialog.scss';
@autoinject
export class AddStepDialog {

  public icons = ICONS;
  public stepType: string;
  public STEP_CONSTANTS = STEP_CONSTANTS;
  public PREDEFINED_STEP_CONFIG = {...PREDEFINED_STEP_CONFIG};
  
  public environments: any = [];
  public organisations: any = [];
  public users: any = [];

  public selectedUser: any;
  public menuCloseTimer: any;
  public userSelectionEnabled: boolean = false;

  public config = {
    environment: 'Prod',
    organisation: null,
    user: null,
  };

  public step: any = {
    config: {}
  };
  private email;
  public isEditing;

  constructor(
    private dialogController: DialogController,
    private httpClient: HttpClient
  ) {}

  public activate(data: { type: string, step: any }): void {
    console.log(' ::>> load config for ', JSON.parse(JSON.stringify(data)));
    this.stepType = data.type;

    if (data.step) {
      this.isEditing = true;
    }

    console.log(' ::>> sign in >>>> 0 ', data.type, STEP_CONSTANTS.SIGN_IN);
    if (data.type === STEP_CONSTANTS.SIGN_IN) {
      console.log(' ::>> sign in >>>> 1 ');
      if (data.step) {
        console.log(' ::>> sign in >>>> 2 ');
        this.PREDEFINED_STEP_CONFIG[STEP_CONSTANTS.SIGN_IN] = data.step.steps;
        this.email = data.step.steps.find(_step => _step.config.label === 'Email').config.value;
        console.log(' ::>> sign in >>>> 3 ', this.email);
      }

      this.getEnvironments();
    } else if (data.type === STEP_CONSTANTS.CLICK_ELEMENT) {
      this.step.config = {
        targetType: 'button'
      };
    }
  }

  private getEnvironments(): void {
    this.httpClient
      .createRequest(`http://localhost:9000/environments`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.environments = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.environments);
          this.selectEnvironment(this.environments[0]);
        } catch(e) {
          console.log(' > Failed to get environments', e);
        }
      });
  }

  public selectEnvironment(environment) {
    this.organisations = [];
    this.users = [];
    this.getOrganisations(environment.name);
  }

  private getOrganisations(environment: string): void {
    this.httpClient
      .createRequest(`http://localhost:9000/organisations`)
      .asGet()
      .withParams({ environment })
      .send()
      .then(data => {
        try {
          this.organisations = JSON.parse(data.response);
          if (this.organisations.length > 0) {
            this.selectOrganisation(this.organisations[0]);
          }
          console.log(' ::>> environments >>> ', this.organisations);
        } catch(e) {
          console.log(' > Failed to get organisations', e);
        }
      });
  }

  public selectOrganisation(organisationData): void {
    console.log(' ::>> selectOrg >>>> ', organisationData);
    const organisation = typeof organisationData === 'string' ? this.organisations.find(org => org.name === organisationData) : organisationData;

    if (organisation.users && organisation.users.length > 0) {
      this.users = organisation.users;
      console.log(' ::>> selectOrg >>>> uers = ', this.users);
      if (this.email) {
        let user = this.users.find(user => user.email === this.email);
        this.selectUser(user);
      } else {
        this.selectUser(this.users[0]);
      }
    } else {
      this.users = [];
    }
  }

  public selectUser(userData: string): void {
    console.log(' ::>> userChanged >>>> ', userData, this.users);
    this.selectedUser = userData;
    this.userSelectionEnabled = false;
    this.config.user = typeof userData === 'string' ? this.users.find(user => user.name === userData) : userData;
    console.log(' ::>> this.config.user >>>>> ', this.config.user);

    if (this.stepType === STEP_CONSTANTS.SIGN_IN) {
      let steps = this.PREDEFINED_STEP_CONFIG['Sign in']
      console.log(' ::>> PREDEFINED_STEP_CONFIG = ', steps);

      steps.forEach(step => {
        if (step.config.label === 'Email') {
          step.config.value = this.config.user.email;
        } else if (step.config.label === 'Password') {
          step.config.value = this.config.user.password;
        } else if (step.name === 'Expect Content') {
          step.config.role = this.config.user.role;

          if (step.config.role === 'Administrator') {
            step.config.selector = '.o-page-header__title.is-dashboard';
          }
        }
      });

    }
  }

  public confirm(): void {
    if (this.stepType === STEP_CONSTANTS.SIGN_IN) {
      const data = JSON.parse(JSON.stringify(PREDEFINED_STEP_CONFIG[STEP_CONSTANTS.SIGN_IN]));

      const URL = this.environments.find(env => env.name === this.config.environment).url;

      console.log(' ::>> config >>>> ', {
        env: this.config.environment,
        URL,
        groupId: uuidv4(),
        groupName: STEP_CONSTANTS.SIGN_IN,
        steps: data
      });
      this.dialogController.ok([{
        groupId: uuidv4(),
        groupName: STEP_CONSTANTS.SIGN_IN,
        url: URL,
        steps: data
      }]);

    } else {
      const payload = {
        name: this.stepType,
        config: {
          ...this.step.config,
          selector: `
            ${this.step.config.targetType}[aria-label="${this.step.config.label}"],
            ${this.step.config.targetType}[placeholder="${this.step.config.label}"],
            ${this.step.config.targetType}[title="${this.step.config.label}"],
            ${this.step.config.targetType}[alt="${this.step.config.label}"]
          `
        }
      };

      console.log(' ::>> add step >>> ', payload);
      this.dialogController.ok([payload]);
    }
  }

  public close(): void {
    this.dialogController.cancel();
  }
  
  public showMenu(): void {
    this.userSelectionEnabled = true;
  }

  public menuEnter(): void {
    window.clearTimeout(this.menuCloseTimer);
  }

  public menuLeave(): void {
    this.menuCloseTimer = setTimeout(() =>{
      this.userSelectionEnabled = false;
    }, 1500);
  }
}
