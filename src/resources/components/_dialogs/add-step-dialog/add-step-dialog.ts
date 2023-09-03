import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

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

  constructor(
    private dialogController: DialogController
  ) {}

  public activate(stepType: string): void {
    console.log(' ::>> load config for ', stepType);
    this.stepType = stepType;
  }

  public confirm(config: any[]): void {
    console.log(' ::>> config >>>> ', config);
    if (this.stepType === STEP_CONSTANTS.SIGN_IN) {
      const data = JSON.parse(JSON.stringify(PREDEFINED_STEP_CONFIG[STEP_CONSTANTS.SIGN_IN]));
      this.dialogController.ok(data);
    }
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
