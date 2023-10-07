import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { ValidationController, ValidationControllerFactory, ValidationRules, validateTrigger } from 'aurelia-validation';
import { HttpClient } from 'aurelia-http-client';

import { ICONS } from 'resources/constants/icons';

import './add-user-dialog.scss';
import { BootstrapFormRenderer } from 'renderers/bootstrap-form-renderer';

@autoinject
export class AddUserDialog {

  public icons = ICONS;
  public validation: ValidationController;
  public roles = [
    'Administrator',
    'Agent',
    'Team Leader',
    'Office Employee',
    'QA Manager',
    'QA',
    'Campaign Manager'
  ];
  
  public organisation: { _id: string; name: string; };
  public name: string = '';
  public email: string = '';
  public password: string = '';
  public role: string = '';

  constructor(
    private dialogController: DialogController,
    public httpClient: HttpClient,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.addRenderer(new BootstrapFormRenderer());
    this.validation.validateTrigger = validateTrigger.change;
  }

  public activate(organisation: { _id: string; name: string; }): void {
    console.log(' ::>> create a user >>> ', organisation);
    this.organisation = organisation;
    
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
        this.createUser();
      });
  }

  private createUser(): void {
    console.log(' ::>> create user >>> ', {
      organisationId: this.organisation._id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    });
    this.httpClient
      .createRequest(`users`)
      .asPost()
      .withContent({
        organisationId: this.organisation._id,
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role
      })
      .send()
      .then(data => {
        try {
          const user = JSON.parse(data.response);
          console.log(' ::>> response >>> user = ', user);
          this.dialogController.ok(user);
        } catch(e) {
          console.log(' > Failed to create user', e);
        }
      });
  }

  public close(): void {
    this.dialogController.cancel();
  }
}
