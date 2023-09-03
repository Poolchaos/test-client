import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ICONS } from '../../../constants/icons';

import './confirm-dialog.scss';

@autoinject
export class ConfirmDialog {

  public icons = ICONS;
  public message: string;
  

  constructor(
    private dialogController: DialogController
  ) {}

  public activate(message: string): void {
    console.log(' ::>> confirm dialog for ', message);
    this.message = message;
  }

  public confirm(): void {
    this.dialogController.ok();
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
