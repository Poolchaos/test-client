import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ICONS } from 'resources/constants/icons';

import './wait-config-dialog.scss';

@autoinject()
export class ConfirmDialog {

  public icons = ICONS;

  constructor(
    private dialogController: DialogController
  ) {}

  public activate(): void {
    
  }

  public confirm(): void {
    this.dialogController.ok();
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
