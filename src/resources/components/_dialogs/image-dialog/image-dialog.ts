import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ICONS } from '../../../constants/icons';

import './image-dialog.scss';

@autoinject
export class ImageDialog {

  public icons = ICONS;
  public number: string;
  public test: any;

  constructor(
    private dialogController: DialogController
  ) {}

  public activate(data: { step: any, number: string }): void {
    console.log(' ::>> image dialog for ', data);
    this.number = data.number;
    this.test = data.step;
  }

  public confirm(): void {
    this.dialogController.ok();
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
