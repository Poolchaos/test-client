import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { ICONS } from 'resources/constants/icons';
import { DataStore } from 'stores/data-store';

@autoinject
export class Users {

  public icons = ICONS;

  public environments: any = [];
  public organisations: any = [];

  constructor(
    private httpClient: HttpClient,
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
          this.organisations = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.organisations);
        } catch(e) {
          console.log(' > Failed to get organisations', e);
        }
      });
  }
}
