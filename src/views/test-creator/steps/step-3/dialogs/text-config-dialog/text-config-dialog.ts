import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ICONS } from 'resources/constants/icons';

import './text-config-dialog.scss';

@autoinject()
export class TextConfigDialog {

  public icons = ICONS;
  public value: string;
  public label: string;

  constructor(
    private dialogController: DialogController
  ) {}

  public activate(): void {
    
  }

  public confirm(): void {
    this.dialogController.ok({
      type: 'text',
      config: {
        value: this.value,
        label: this.label
      }
    });
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
