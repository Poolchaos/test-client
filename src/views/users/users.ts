import { autoinject } from 'aurelia-framework';

import { ICONS } from 'resources/constants/icons';

import './users.scss';

@autoinject
export class Users {

  public icons = ICONS;

  public environments: any = [{
    name: 'Prod',
    url: 'https://conversations.zailab.com'
  }, {
    name: 'Beta',
    url: 'https://beta.zailab.com'
  }, {
    name: 'Staging',
    url: 'https://staging.zailab.com'
  }];
  public selectedEnvironment;

  public organisations: any = [{
    name: 'Vodacom Demo',
    users: [{
      name: 'Wendy Wacko',
      email: 'meryam7@zailab.com',
      password: 'Test1234',
      role: 'Administrator',
      environment: 'Beta'
    }, {
      name: 'Beau Easton',
      email: 'tiaan+285@zailab.com',
      password: 'Test1234',
      role: 'Agent',
      environment: 'Beta'
    }, {
      name: 'Donald Stern',
      email: 'tiaan+55@zailab.com',
      password: 'Test1234',
      role: 'Team Leader',
      environment: 'Beta'
    }, {
      name: 'Alice Wonders',
      email: 'meryam+7@zailab.co.uk',
      password: 'Test1234',
      role: 'Campaign Manager',
      environment: 'Beta'
    }, {
      name: 'Meryam QA',
      email: 'meryam16@zailab.com',
      password: 'Test1234',
      role: 'QA',
      environment: 'Beta'
    }, {
      name: 'Meryam QA MAN',
      email: 'meryam15@zailab.com',
      password: 'Test1234',
      role: 'QA Manager',
      environment: 'Beta'
    }, {
      name: 'Mike Scattered',
      email: 'meryam+@zailab.co.za',
      password: 'Test1234',
      role: 'Campaign Manager',
      environment: 'Beta'
    }, {
      name: 'Meryam Office',
      email: 'meryam+222@zailab.com',
      password: 'Test1234',
      role: 'Office Employee',
      environment: 'Beta'
    }]
  }];

  constructor() {
    this.selectEnvironment(this.environments[0]);
  }

  public selectEnvironment(environment) {
    this.environments.forEach(env => env.selected = false);
    environment.selected = true;
    this.selectedEnvironment = environment;
  }
}
