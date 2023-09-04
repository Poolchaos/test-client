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

  constructor(
    private dialogController: DialogController,
    private httpClient: HttpClient
  ) {}

  public activate(stepType: string): void {
    console.log(' ::>> load config for ', stepType);
    this.stepType = stepType;
    this.getEnvironments();
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
      this.selectUser(this.users[0]);
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
        } else if (step.name === 'expectDasboard') {
          step.config.role = this.config.user.role;
        }
      });

    }
  }

  public confirm(config: any[]): void {
    console.log(' ::>> config >>>> ', config);
    if (this.stepType === STEP_CONSTANTS.SIGN_IN) {
      const data = JSON.parse(JSON.stringify(PREDEFINED_STEP_CONFIG[STEP_CONSTANTS.SIGN_IN]));
      this.dialogController.ok([{
        groupId: uuidv4(),
        groupName: STEP_CONSTANTS.SIGN_IN,
        steps: data
      }]);
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
