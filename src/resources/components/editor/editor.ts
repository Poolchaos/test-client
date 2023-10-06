import { Router } from 'aurelia-router';
import { bindable, autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';

import moment from 'moment';

import { ICONS } from './../../constants/icons';

import './editor.scss';

interface IConfig {
  testSuiteId: string;
  _id: string;
  testId: string;
  name: string;
  type: string;
  environment: { name: string; url: string; }
  steps: IStep[];
}

interface IStep {
  name: string;
  type: string;
  config: {
    label?: string;
    value?: string;
  },
  tempData?: any,
  predefined?: boolean;
  identity?: string;
  userEndIndex?: number;
  error?: boolean;
}

@autoinject
export class Editor {
  @bindable({ attribute: 'config' }) public config: IConfig;

  public icons = ICONS;
  public loading: boolean = false;
  public testResults: any = [];
  private predefinedRequiredConfigs = {
    users: [],
    apiRequest: false
  };
  public environment: string;
  public environments: any = [];
  public requestApis: any = [];

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private eventAggregator: EventAggregator
  ) {}

  public bind() {
    console.log(' ::>> config = 1 ', this.config);
    if (this.config.type === 'partial') {
      this.getSubTestConfig();
    } else if (this.config.type === 'complete') {
      this.getTestConfig();
    }
    this.getTestResults();
    this.getEnvironments();
  }

  private getSubTestConfig(): void {
    this.httpClient
      .createRequest(`sub-tests/${this.config._id}`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.config = {
            ...this.config,
            ...JSON.parse(data.response)
          };
          console.log(' ::>> query test data | data = ', this.config);
        } catch(e) {
          console.error(' ::>> Failed to get test config >>> ', e);
        }
      })
      .catch(e => {});
  }

  private getTestConfig(): void {
    this.httpClient
      .createRequest(`test-suites/${this.config.testSuiteId}/test/${this.config.testId}`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.config = {
            ...this.config,
            ...JSON.parse(data.response)
          };
          console.log(' ::>> query test data | data = ', this.config);
        } catch(e) {
          console.error(' ::>> Failed to get test config >>> ', e);
        }
      })
      .catch(e => {});
  }

  private getTestResults(): void {
    console.log(' ::>> 1693747142644 >> ', moment(1693747142644).format('DD/MM/YYYY HH:mm:ss'));


    this.httpClient
      .createRequest(`results`)
      .asGet()
      .withParams({ testId: this.config.testId })
      .send()
      .then(data => {
        try {
          const parsedData = JSON.parse(data.response);
          if (!parsedData) {
            return;
          }

          const testResults = JSON.parse(data.response).results.reverse();
          this.testResults = testResults.map(result => {

            if (result.startTime && result.startTime.indexOf('Z') < 0) {
              result.startTime = parseInt(result.startTime);
            }
            console.log(' ::>> result.startTime >>>> ', result.startTime);

            result.startTime = moment(result.startTime).format('DD/MM/YYYY HH:mm:ss');
            result.endTime = moment(result.endTime).format('DD/MM/YYYY HH:mm:ss');
            result.testPassed = result.passed === result.total;
            return result;
          });
          console.log(' ::>> query test results data | data = ', this.testResults);
        } catch(e) {
          console.error(' ::>> Failed to get test results >>> ', e);
        }
      })
      .catch(e => {});
  }
  
  private getEnvironments(): void {
    this.httpClient
      .createRequest(`environments`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.environments = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.environments);
        } catch(e) {
          console.log(' > Failed to get environments', e);
        }
      });
  }



  public configuringTest: boolean = false;
  public userArray = [];
  public configureTestToRun(): void {
    this.configuringTest = true;
    console.log(' ::>> configureTestToRun >>>> >', {
      config: this.config,
      steps: this.config.steps
    });
    // // @ts-ignore
    // this.config.steps = mock_data;

    let userCounter = 0; // Start with 0 users
    let stepIndexEmail = [];
    let stepIndexPassword = [];
    let currentUser = null;

    for (let i = 0; i < this.config.steps.length; i++) {
      const step = this.config.steps[i];
    // for (let i = 0; i < mock_data.length; i++) {
    //   const step = mock_data[i];
      
      if (step.predefined) {
        if (step.config.value === "{{ email }}") {
          if (currentUser !== null) {
            userCounter++;
          }
          stepIndexEmail.push(i);
          currentUser = `User ${userCounter + 1}`;
        } else if (step.config.value === "{{ password }}") {
          stepIndexPassword.push(i);
        }
      }
      
      // Execute the test step (e.g., perform a "click" action or "wait")
      console.log(`${currentUser}: Executing step ${i}: ${step.name || step.type}`);
    }

    // After the loop, check if the last user's steps were completed
    if (currentUser !== null) {
      userCounter++;
    }

    console.log(`Total users: ${userCounter}`);
    console.log(`Step indices for Email: ${stepIndexEmail}`);
    console.log(`Step indices for Password: ${stepIndexPassword}`);


    for (let i = 0; i < userCounter; i++) {
      const user = {
        placeholder: `User ${i + 1}`,
        emailIndex: stepIndexEmail[i],
        passwordIndex: stepIndexPassword[i],
      };
      this.userArray.push(user);
    }

    this.identifyUserSlots();
  }

  private identifyUserSlots() {
    console.log(' ::>> userArray >>>>> ', this.userArray);

    this.userArray.forEach(user => {
      if (user.emailIndex >= 0) {
        this.config.steps[user.emailIndex].identity = user.placeholder;
      }
      if (user.passwordIndex >= 0) {
        this.config.steps[user.passwordIndex].identity = user.placeholder;
      }

      if (
        user.emailIndex >= 0 &&
        user.passwordIndex >= 0
      ) {
        if (user.emailIndex < user.passwordIndex) {
          this.config.steps[user.passwordIndex].userEndIndex = user.passwordIndex;
        } else {
          this.config.steps[user.passwordIndex].userEndIndex = user.emailIndex;
        }
      }
    });

    console.log(' ::>> this.config.steps >>>> ', this.config.steps);
  }

  public enableUserSelect(user: any): void {
    user.selectEnabled = true;
    console.log(' ::>> user >>>> ', user);
  }

  public userSelected(selectedUser: any, user: any): void {
    console.log(' ::>> user selected >>>>> ', { selectedUser, user });
    user.selectEnabled = false;
    this.config.steps[user.emailIndex].tempData = selectedUser;
    this.config.steps[user.passwordIndex].tempData = selectedUser;
    
    this.config.steps[user.emailIndex].config.value = selectedUser.email;
    this.config.steps[user.passwordIndex].config.value = selectedUser.password;

    user.config = selectedUser;
  }




  

  public runTest(): void {
    this.loading = true;
    if (!this.environment) {
      this.eventAggregator.publish('toastr:error', 'Please select an environment.');
      return;
    }
    if (this.config.type === 'partial') {
      this.eventAggregator.publish('toastr:error', 'Sub-tests cannot be run.');
      return;
    }
    console.log(' ::>> run test > config >', this.config);

    let testRequestData = {
      environment: this.environments.find(env => env.name === this.environment),
      testSuiteId: this.config.testSuiteId,
      testId: this.config.testId,
      name: this.config.name,
      steps: this.config.steps.map(step => {
        return {
          type: step.type,
          predefined: step.predefined,
          config: step.config
        };
      })
    };
    
    console.log(' ::>> run test > testRequestData > ', testRequestData);

    this.testResults.unshift({
      startTime: moment().format('DD/MM/YYYY HH:mm:ss'),
      ongoing: true
    });

    this.httpClient
      .createRequest('automate')
      .asPost()
      .withContent(testRequestData)
      .send()
      .then(data => {
        console.log(' ::>> data >>>> ', data);
      })
      .catch(e => {
        console.error(e);
        this.loading = false;
      });
  }

  public viewTestResult(result): void {
    this.router.navigate('view-test-result/' + this.config.testId + '-' + this.config.name + '-' + result._id);
  }

  public edit(): void {
    console.log(' ::>> this.config >>>> ', this.config);
    if (this.config.type === 'complete') {
    this.router.navigate('test-wizard/' + this.config.testSuiteId + '/' + this.config.testId);
    } else if (this.config.type === 'partial') {
      this.router.navigate('test-wizard/sub-test/' + this.config._id);
    }
  }

  public get configurationsDone(): boolean {
    if (this.userArray.length > 0) {
      let dataNotConfigured = this.userArray.find(user => !user.config || !user.config.email || !user.config.password);
      if (dataNotConfigured) {
        return false;
      }
    }
    return true;
  }
}



const mock_data = [
  {
      "type": "text",
      "predefined": true,
      "config": {
          "value": "{{ email }}",
          "label": "Email"
      }
  },
  {
      "type": "text",
      "predefined": true,
      "config": {
          "value": "{{ password }}",
          "label": "Password"
      }
  },
  {
      "type": "click",
      "config": {
          "value": "SIGN IN"
      }
  }, {
    "type": "window",
    "name": "Open new browser window"
  }, {
      "type": "text",
      "predefined": true,
      "config": {
          "value": "{{ email }}",
          "label": "Email"
      }
  }, {
      "type": "text",
      "predefined": true,
      "config": {
          "value": "{{ password }}",
          "label": "Password"
      }
  }, {
      "type": "click",
      "config": {
          "value": "SIGN IN"
      }
  }
]
