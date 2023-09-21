import { bindable } from 'aurelia-framework';
import { ICONS } from 'resources/constants/icons';

import './steps.scss';

export class Steps {
  @bindable public steps: any[] = [];
  @bindable public editable: boolean;

  public icons = ICONS;
  
  public deleteStepGroup = (group: { groupId: string }): void => {
    this.steps = this.steps.filter(step => step.groupId !== group.groupId);
  }
}
