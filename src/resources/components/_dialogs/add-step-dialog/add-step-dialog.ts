import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { HttpClient } from 'aurelia-http-client';

import { v4 as uuidv4 } from 'uuid';

import { STEP_CONSTANTS } from '../../../../views/test-creator/steps/step-constants';
import { PREDEFINED_STEP_CONFIG } from './predefined-config';
import { PREDEFINED_REGISTER_STEP_CONFIG } from './predefined-register-config';
import { CALL_STEP_CONFIG } from './predefined-make-outbound-call';

import { ICONS } from '../../../constants/icons';

import './add-step-dialog.scss';

@autoinject
export class AddStepDialog {

  public icons = ICONS;
  public stepType: string;
  public STEP_CONSTANTS = STEP_CONSTANTS;
  public PREDEFINED_STEP_CONFIG = {...PREDEFINED_STEP_CONFIG};
  public PREDEFINED_REGISTER_STEP_CONFIG = {...PREDEFINED_REGISTER_STEP_CONFIG};
  public CALL_STEP_CONFIG = {...CALL_STEP_CONFIG};
  
  public environments: any = [];
  public organisations: any = [];
  public users: any = [];

  public selectedUser: any;
  public menuCloseTimer: any;
  public userSelectionEnabled: boolean = false;

  public config = {
    environment: 'Prod',
    organisation: null,
    user: null
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


    this.httpClient.configure(req => {
      req.withHeader('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJQRVJNSVNTSU9OUyI6IntcIkJVU0lORVNTX1BBUlRORVJTXCI6W10sXCJURUFNU1wiOltcImZiY2EwYTc0LWJkOTUtNDk4NS1hMWE3LTUxNjBkNzAxN2YyM1wiLFwiM2M0ZDBiNGMtM2M2NC00Y2JiLTg0MTYtZmExZWNkYTg5ZTQ1XCIsXCI3ZDI3NjE2MC00MDg0LTQ0MTYtYTg3OS02ZTkzOTgzZjdkMzZcIixcIjdiY2IzZjQyLWRiZTAtNDBmZC04NzA2LWJkYzdmNzBiNWM1YlwiXSxcIkNPTlRBQ1RfQ0VOVFJFU1wiOltdfSIsIm5iZiI6MTY5NDAyMTk5NSwiaXNzIjoiemFpbGFiIiwiVVNFUiI6IntcInVzZXJJZFwiOlwiMDZhOTA2ZjYtZDdlMy00MmEwLTllNWEtMzcxOTc1ZmUyOTYyXCIsXCJ1c2VybmFtZVwiOm51bGwsXCJvcmdhbmlzYXRpb25JZFwiOlwiNDc2N2M5OTktNzhmYi00OWNiLTg4MGUtNGZmNmU0ZjdlMjhjXCIsXCJyb2xlc1wiOlt7XCJvcmdhbmlzYXRpb25JZFwiOlwiNDc2N2M5OTktNzhmYi00OWNiLTg4MGUtNGZmNmU0ZjdlMjhjXCIsXCJhY2NvdW50VHlwZVwiOlwiT1JHQU5JU0FUSU9OXCIsXCJyb2xlXCI6XCJBR0VOVFwiLFwibWVtYmVySWRcIjpcIjE4Nzg3YTlhLWMzOGUtNGVmYS05NTlhLThkMjBjY2E0NTY3MFwifV19IiwiaWF0IjoxNjk0MDIxOTk1LCJqdGkiOiJlMWI4ZjE4MC0yOWU4LTQ1NzktODM5YS04ZDlhZTA2NDhjMTYifQ.a3VNC-MJo4Ov85zPc7qu_Ckls5Ii3lc6CABYVKis1iHyFTJ_X6eL36alqSP8GqrNGQ9nT3DTKUhh3Efu-Th2Mg');
      req.withHeader('Session', '96892755-762c-459a-97f8-05f217407479');
    });





    console.log(' ::>> load config for ', JSON.parse(JSON.stringify(data)));
    this.stepType = data.type;

    if (data.step) {
      this.isEditing = true;
    }

    if (data.type === STEP_CONSTANTS.SIGN_IN) {
      if (data.step) {
        this.PREDEFINED_STEP_CONFIG[STEP_CONSTANTS.SIGN_IN] = data.step.steps;
        this.email = data.step.steps.find(_step => _step.config.label === 'Email').config.value;
      }

      this.getEnvironments();
    } if (data.type === STEP_CONSTANTS.REGISTER) {
      if (data.step) {
        this.PREDEFINED_REGISTER_STEP_CONFIG[STEP_CONSTANTS.REGISTER] = data.step.steps;
      }
      console.log(' ::>> registration data >>> ', PREDEFINED_REGISTER_STEP_CONFIG[STEP_CONSTANTS.REGISTER]);
      this.getEnvironments();
      
    } if (data.type === STEP_CONSTANTS.COMPLETE_REGISTRATION) {
      if (data.step) {
        this.PREDEFINED_STEP_CONFIG[STEP_CONSTANTS.COMPLETE_REGISTRATION] = data.step.steps;
      }
      
    } else if (data.type === STEP_CONSTANTS.CLICK_ELEMENT) {
      this.step.config = {
        targetType: 'button'
      };
      
    } else if (data.type === STEP_CONSTANTS.REQUEST) {
      console.log(' ::>> request >>>>>>');
      
      this.step = {
        name: data.type,
        config: {
          URL: 'https://za.dev1.zailab.com/v1/telephony/calls',
          method: 'Post',
          headers: [{
            Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJQRVJNSVNTSU9OUyI6IntcIkJVU0lORVNTX1BBUlRORVJTXCI6W10sXCJURUFNU1wiOltcImZiY2EwYTc0LWJkOTUtNDk4NS1hMWE3LTUxNjBkNzAxN2YyM1wiLFwiM2M0ZDBiNGMtM2M2NC00Y2JiLTg0MTYtZmExZWNkYTg5ZTQ1XCIsXCI3ZDI3NjE2MC00MDg0LTQ0MTYtYTg3OS02ZTkzOTgzZjdkMzZcIixcIjdiY2IzZjQyLWRiZTAtNDBmZC04NzA2LWJkYzdmNzBiNWM1YlwiXSxcIkNPTlRBQ1RfQ0VOVFJFU1wiOltdfSIsIm5iZiI6MTY5NDAyMTk5NSwiaXNzIjoiemFpbGFiIiwiVVNFUiI6IntcInVzZXJJZFwiOlwiMDZhOTA2ZjYtZDdlMy00MmEwLTllNWEtMzcxOTc1ZmUyOTYyXCIsXCJ1c2VybmFtZVwiOm51bGwsXCJvcmdhbmlzYXRpb25JZFwiOlwiNDc2N2M5OTktNzhmYi00OWNiLTg4MGUtNGZmNmU0ZjdlMjhjXCIsXCJyb2xlc1wiOlt7XCJvcmdhbmlzYXRpb25JZFwiOlwiNDc2N2M5OTktNzhmYi00OWNiLTg4MGUtNGZmNmU0ZjdlMjhjXCIsXCJhY2NvdW50VHlwZVwiOlwiT1JHQU5JU0FUSU9OXCIsXCJyb2xlXCI6XCJBR0VOVFwiLFwibWVtYmVySWRcIjpcIjE4Nzg3YTlhLWMzOGUtNGVmYS05NTlhLThkMjBjY2E0NTY3MFwifV19IiwiaWF0IjoxNjk0MDIxOTk1LCJqdGkiOiJlMWI4ZjE4MC0yOWU4LTQ1NzktODM5YS04ZDlhZTA2NDhjMTYifQ.a3VNC-MJo4Ov85zPc7qu_Ckls5Ii3lc6CABYVKis1iHyFTJ_X6eL36alqSP8GqrNGQ9nT3DTKUhh3Efu-Th2Mg',
            'Content-Type': 'application/json'
          }],
          body: {
            from: "flaap+4@zailab.com",
            to: "+27712569431",
            metadata: {
              flowId: "a8fb46a6-cb2b-463e-8d3f-e38896af8b86",
              isClickToDial: true
            },
            webhookAdditionalProperties: null
          }
        }
      };

      
      // this.httpClient
      //   .createRequest(this.step.config.URL)
      //   .asPost()
      //   .withContent(this.step.config.data)
      //   .send()
      //   .then(() => {
      //     console.log(' ::>> click to dial success ');
      //   })
      //   .catch(e => {
      //     console.log(' ::>> click to dial fail ', e);
      //   });
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
    if (this.stepType === STEP_CONSTANTS.SIGN_IN) {
      this.getOrganisations(environment.name);
    }
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
    // this.config.user = typeof userData === 'string' ? this.users.find(user => user.name === userData) : userData;

    this.config.user = {
      email: 'flaap+272@zailab.com',
      password: 'Test1234',
      name: 'Ana Mayer',
      role: 'Agent'
    };
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
          } else if (step.config.role === 'Agent') {
            step.config.selector = 'z-contact-controller';
          }
        }
      });

    }
  }

  public confirm(): void {

    if (
      this.stepType === STEP_CONSTANTS.SIGN_IN ||
      this.stepType === STEP_CONSTANTS.REGISTER ||
      this.stepType === STEP_CONSTANTS.OUTBOUND_CALL
    ) {
      let data, URL;
      if (this.stepType === STEP_CONSTANTS.SIGN_IN) {
        data = JSON.parse(JSON.stringify(PREDEFINED_STEP_CONFIG[STEP_CONSTANTS.SIGN_IN]));
        URL = this.environments.find(env => env.name === this.config.environment).url;
      }
      
      if (this.stepType === STEP_CONSTANTS.REGISTER) {
        data = JSON.parse(JSON.stringify(PREDEFINED_REGISTER_STEP_CONFIG[STEP_CONSTANTS.REGISTER]));
        URL = this.environments.find(env => env.name === this.config.environment).url;
      }

      let payload = {
        groupId: uuidv4(),
        groupName: this.stepType,
        url: 'https://latest.conversations.dev1.zailab.com/',
        steps: data
      };
      
      if (this.stepType === STEP_CONSTANTS.OUTBOUND_CALL) {
        payload.steps = JSON.parse(JSON.stringify(CALL_STEP_CONFIG[STEP_CONSTANTS.OUTBOUND_CALL]));
        delete payload.url;
      }

      console.log(' ::>> config >>>> ', {
        env: this.config.environment,
        URL,
        groupId: uuidv4(),
        groupName: this.stepType,
        steps: data
      });
      this.dialogController.ok([payload]);

    } else if(this.stepType === STEP_CONSTANTS.REQUEST) {
      
      const payload = {
        name: this.stepType,
        config: {
          ...this.step.config
        }
      };

      let value = [{
        groupId: uuidv4(),
        groupName: this.stepType,
        url: 'https://latest.conversations.dev1.zailab.com/',
        steps: [{
          name: 'wait',
          config: {
            durationInSeconds: 30
          }
        },
          this.step,
        {
          name: 'wait',
          config: {
            durationInSeconds: 30
          }
        }]
      }];

      console.log(' ::>> value => ', value);

      this.dialogController.ok(value);

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
