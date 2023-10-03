import { bindable, inject } from 'aurelia-framework';
import { BootstrapFormRenderer } from 'renderers/bootstrap-form-renderer';
import { ValidationControllerFactory, validateTrigger, ValidationController, ValidationRules } from 'aurelia-validation';

import './creator-step-one.scss';
import { ICONS } from 'resources/constants/icons';

@inject(Element, ValidationControllerFactory)
export class CreatorStepOne {
  @bindable({ attribute: 'test-data' }) testData: any;

  public icons = ICONS;
  private validation: ValidationController;
  
  constructor(
    private element: Element,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.addRenderer(new BootstrapFormRenderer());
    this.validation.validateTrigger = validateTrigger.change;
  }

  public bind(): void {
    ValidationRules
      .ensure('name')
      .required().withMessage('Please enter a name for your test.')
      .on(this.testData);
  }

  public changetestType(type: string): void {
    this.testData.type = type;
  }

  public submit(): void {
    this.validation
      .validate()
      .then(result => {
        if (!result.valid) {
          return;
        }
        
        this.element.dispatchEvent(
          new CustomEvent('step-configured', {
            bubbles: true,
            detail: {}
          })
        );
      });
  }
}
