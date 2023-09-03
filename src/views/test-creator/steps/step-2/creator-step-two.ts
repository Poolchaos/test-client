import { ICONS } from './../../../../resources/constants/icons';
import { bindable, inject } from 'aurelia-framework';
import { BootstrapFormRenderer } from 'renderers/bootstrap-form-renderer';
import { ValidationControllerFactory, validateTrigger, ValidationController, ValidationRules } from 'aurelia-validation';

import './creator-step-two.scss';

@inject(Element, ValidationControllerFactory)
export class CreatorStepTwo {
  @bindable({ attribute: 'test-data' }) testData: any;

  private validation: ValidationController;
  public validationError: string;
  public icons = ICONS;

  public browserOptions = [{
    name: 'Google Chrome',
    logo: ICONS.browser['Google Chrome'],
    selected: true
  }, {
    name: 'Mozilla Firefox',
    logo: ICONS.browser['Mozilla Firefox'],
    selected: false
  }, {
    name: 'Microsoft Edge',
    logo: ICONS.browser['Microsoft Edge'],
    selected: false
  }];

  public configOptions = [{
    name: 'Permission to access your microphone',
    key: 'microphone',
    logo: ICONS.mic,
    selected: true
  }, {
    name: 'Capture the screen when an error occurs',
    key: 'errorScreenShot',
    logo: ICONS.pic,
    selected: false
  }, {
    name: 'Take a screenshot after each step',
    key: 'stepScreenshot',
    logo: ICONS.pic,
    selected: false
  }];

  constructor(
    private element: Element,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.addRenderer(new BootstrapFormRenderer());
    this.validation.validateTrigger = validateTrigger.change;
  }

  public bind(): void {
    ValidationRules.customRule(
      'validUrl',
      (value, obj) => {
        if (!value) {
          return true; // Skip validation if the field is empty (handled by required rule)
        }
        // Use a regular expression to validate the URL format
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlPattern.test(value);
      },
      '${$displayName} must be a valid URL.'
    );

    ValidationRules
      .ensure('url')
      .required().withMessage('Please enter a name for your test.')
      .satisfiesRule('validUrl')
      .on(this.testData);
  }

  public stepBack(): void {
    console.log(' ::>> stepBack >>>> ');
    this.element.dispatchEvent(
      new CustomEvent('step-back', {
        bubbles: true,
        detail: {}
      })
    );
  }

  public browserSelectionChanged(browser: { name }): void {
    this.browserOptions.forEach(_browser => {
      if (_browser.name !== browser.name) {
        _browser.selected = false;
      }
    })
    this.validationError = null;
  }

  public submit(): void {
    this.validationError = null;
    this.validation
      .validate()
      .then(result => {
        if (!result.valid) {
          return;
        }

        const selectedBrowser = this.browserOptions.find(browser => browser.selected);
        if (!selectedBrowser) {
          this.validationError = 'At least one browser must be selected.';
          return;
        }
        this.testData.browser = selectedBrowser.name;
        this.testData.permissions = {};

        this.configOptions.forEach(config => {
          this.testData.permissions[config.key] = !!config.selected;
        })
        
        this.element.dispatchEvent(
          new CustomEvent('step-configured', {
            bubbles: true,
            detail: {}
          })
        );
      });
  }
}
