import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { ValidationController, ValidationControllerFactory, ValidationRules, validateTrigger } from 'aurelia-validation';

import './environment-dialog.scss';
import { ICONS } from 'resources/constants/icons';
import { EnvironmentService } from '../environment-service';

@autoinject
export class EnvironmentDialog {

  private validation: ValidationController;

  public icons = ICONS;
  public name: string;
  public url: string;

  constructor(
    private dialogController: DialogController,
    private environmentService: EnvironmentService,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }

  public activate(): void {
    this.setupValidations();
  }

  private setupValidations(): void {
    ValidationRules.ensure('name')
      .required()
      .withMessage('Please enter a name.')
      .ensure('url')
      .required()
      .withMessage('Please enter your password.')
      .on(this);
  }

  public confirm(): void {
    this.validation
    .validate()
    .then(validation => {
      if (!validation.valid) {
        console.log(' ::>> is not valid ');
        return;
      }
      this.createEnvironment();
    });
  }

  private createEnvironment(): void {
    this.environmentService
      .createEnvironment(this.name, this.url)
      .then((response) => this.dialogController.ok(response));
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
