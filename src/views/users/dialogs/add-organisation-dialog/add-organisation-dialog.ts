import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { ValidationController, ValidationControllerFactory, ValidationRules, validateTrigger } from 'aurelia-validation';
import { HttpClient } from 'aurelia-http-client';

import { ICONS } from 'resources/constants/icons';

import './add-organisation-dialog.scss';
import { BootstrapFormRenderer } from 'renderers/bootstrap-form-renderer';

@autoinject
export class AddOrganisationDialog {

  public icons = ICONS;
  public validation: ValidationController;
  
  public name: string = '';
  public environment: string;

  constructor(
    private dialogController: DialogController,
    public httpClient: HttpClient,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.addRenderer(new BootstrapFormRenderer());
    this.validation.validateTrigger = validateTrigger.change;
  }

  public activate(environment: string): void {
    console.log(' ::>> create an organisation >>> ', environment);
    this.environment = environment;
    
    ValidationRules
      .ensure('name')
      .required().withMessage('Please enter a name.')
      .on(this);
  }

  public confirm(): void {
    this.validation
      .validate()
      .then(result => {
        if (!result.valid) {
          return;
        }
        this.createOrganisation();
      });
  }

  private createOrganisation(): void {
    console.log(' ::>> createOrg >>> ', this.name);
    this.httpClient
      .createRequest(`organisations`)
      .asPost()
      .withContent({
        name: this.name,
        environment: this.environment
      })
      .send()
      .then(data => {
        try {
          const organisation = JSON.parse(data.response);
          console.log(' ::>> response >>> organisation = ', organisation);
          this.dialogController.ok(organisation);
        } catch(e) {
          console.log(' > Failed to create organisation', e);
        }
      });
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
