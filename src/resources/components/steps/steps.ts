import { Router } from 'aurelia-router';
import { bindable, autoinject } from 'aurelia-framework';
import { ICONS } from 'resources/constants/icons';

import './steps.scss';

@autoinject
export class Steps {
  @bindable({ attribute: 'test-suite-id' }) public testSuiteId: string;
  @bindable({ attribute: 'test-id' }) public testId: string;
  @bindable public steps: any[] = [];
  @bindable public editable: boolean;
  @bindable public deletable: boolean;

  public icons = ICONS;

  constructor(
    private router: Router
  ) {}
  
  public deleteStepGroup = (group: { groupId: string }): void => {
    this.steps = this.steps.filter(step => step.groupId !== group.groupId);
  }
  

  public editTestSuite(): void {
    this.router.navigate('test-wizard/' + this.testSuiteId + '/' + this.testId);
  }
}
