import { DialogController } from 'aurelia-dialog';
import { autoinject, bindable, computedFrom } from 'aurelia-framework';
import { ValidationControllerFactory, validateTrigger, ValidationController, ValidationRules } from 'aurelia-validation';
import { BootstrapFormRenderer } from 'renderers/bootstrap-form-renderer';
import { ICONS } from 'resources/constants/icons';

import './new-test-suite-dialog.scss';

@autoinject()
export class NewTestSuiteDialog {
  @bindable private names: string[] = [];

  public icons = ICONS;
  public validation: ValidationController;
  public isEnabled: boolean = false;

  public name: string = '';

  constructor(
    private dialogController: DialogController,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.addRenderer(new BootstrapFormRenderer());
    this.validation.validateTrigger = validateTrigger.change;
  }

  public bind(): void {
    ValidationRules
      .customRule('uniqueName', (value) => {
        for (let name of this.names) {
          if (name.toLowerCase() === value.toLowerCase()) {
            return false;
          }
        }
        return true;
      }, 'Please enter a unique name.');

    ValidationRules
      .ensure('name')
      .required().withMessage('Please enter a name.')
      .satisfiesRule('uniqueName')
      .on(this);
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public confirm(): void {
    this.validation
      .validate()
      .then(result => {
        if (!result.valid) {
          return;
        }
        this.dialogController.ok(this.name);
      });
  }
  
  public close(): void {
    this.dialogController.cancel();
  }

  @computedFrom('validation', 'validation.errors', 'validation.errors.length')
  public get validName(): boolean {
    if (this.validation.errors) {
      let validation = this.validation.errors.find(error => error.propertyName === 'name');
      if (validation) {
        return validation.valid;
      }
    }
    return true;
  }
}
