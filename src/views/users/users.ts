import { DialogService } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { ICONS } from 'resources/constants/icons';
import { DataStore } from 'stores/data-store';
import { AddOrganisationDialog } from './dialogs/add-organisation-dialog/add-organisation-dialog';
import { ConfirmDialog } from 'resources/components/_dialogs/confirm-dialog/confirm-dialog';
import { ArrayTools } from 'assets/tools/array.tools';
import { AddUserDialog } from './dialogs/add-user-dialog/add-user-dialog';

@autoinject
export class Users {

  public icons = ICONS;

  public environments: any = [];
  public organisations: any = [];

  constructor(
    private httpClient: HttpClient,
    public dialogService: DialogService,
    public dataStore: DataStore
  ) {}

  public bind(): void {
    console.log(' ::>> binded env ');
    this.getEnvironments();
  }

  private getEnvironments(): void {
    this.httpClient
      .createRequest(`environments`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.environments = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.environments);
          this.selectEnvironment(this.environments[0]);
        } catch(e) {
          console.log(' > Failed to get environments', e);
        }
      });
  }

  public selectEnvironment(environment) {
    this.environments.forEach(env => env.selected = false);
    environment.selected = true;

    this.getOrganisations(environment.name);
  }

  private getOrganisations(environment: string): void {
    this.httpClient
      .createRequest(`organisations`)
      .asGet()
      .withParams({ environment })
      .send()
      .then(data => {
        try {
          this.organisations = ArrayTools.sort(JSON.parse(data.response), 'name');
          console.log(' ::>> organisations >>> ', this.organisations);
        } catch(e) {
          console.log(' > Failed to get organisations', e);
        }
      });
  }

  /////////////////////////////
  // user section
  /////////////////////////////

  public addUser(organisation: any): void {
    console.log(' ::>> addUser >>>>> ', organisation);
    
    this.dialogService
      .open({ viewModel: AddUserDialog, model: organisation })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          let environment = this.environments.find(env => env.selected);
          this.getOrganisations(environment.name);
        }
      });
  }

  public deleteUser(user: { _id: string; name: string }): void {
    console.log(' ::>> user >>>>> ', user);

    this.dialogService
      .open({ viewModel: ConfirmDialog, model: `Are you sure you want to delete ${user.name}?` })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.handleUserDeletionConfirmed(user);
        }
      });
  }

  private handleUserDeletionConfirmed(user: { _id: string }): void {
    this.httpClient
      .createRequest(`users/${user._id}`)
      .asDelete()
      .send()
      .then(() => {
        let environment = this.environments.find(env => env.selected);
        this.getOrganisations(environment.name);
      });
  }

  /////////////////////////////
  // Organisation section
  /////////////////////////////

  public addOrganisation(): void {
    let environment = this.environments.find(env => env.selected);
    if (!environment) {
      return;
    }
    console.log(' ::>> addOrganisation >>>>> ', environment);
    
    this.dialogService
      .open({ viewModel: AddOrganisationDialog, model: environment.name })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          console.log(' ::>> organisation added >>> ', response.output);
          let organisations = this.organisations.concat([response.output]);
          this.organisations = ArrayTools.sort(organisations, 'name');
        }
      });
  }

  public deleteOrganisation(organisation: { _id: string; name: string }): void {
    console.log(' ::>> organisation >>>>> ', organisation);

    this.dialogService
      .open({ viewModel: ConfirmDialog, model: `Are you sure you want to delete ${organisation.name}?<br/><br/><span class="text-blue">This will remove all members as well.</span>` })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.handleOrganisationDeletionConfirmed(organisation);
        }
      });
  }

  private handleOrganisationDeletionConfirmed(organisation: { _id: string }): void {
    this.httpClient
      .createRequest(`organisations/${organisation._id}`)
      .asDelete()
      .send()
      .then(data => {
        this.organisations = this.organisations.filter(org => org._id !== organisation._id);
      });
  }
}
