
import { bindable } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-http-client';

import { ICONS } from 'resources/constants/icons';

import './select-user.scss';

@inject(Element, HttpClient)
export class SelectUser {
  @bindable private environment: any;

  public icons = ICONS;
  private organisations = [];
  private users = [];
  public selectedUser: any;
  public menuCloseTimer: any;
  public userSelectionEnabled: boolean = false;

  constructor(
    private element: Element,
    private httpClient: HttpClient
  ) {}

  public environmentChanged(): void {
    console.log(' ::>> environment >>>> ', this.environment);
    if (this.environment) {
      this.getOrganisations(this.environment);
    }
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
          if (this.organisations.length > 0) {
            this.selectOrganisation(this.organisations[0]);
          }
          console.log(' ::>> environments >>> ', this.organisations);
        } catch(e) {
          console.log(' > Failed to get organisations', e);
        }
      });
  }

  public selectOrganisation(organisationData): void {
    console.log(' ::>> selectOrg >>>> ', organisationData);
    const organisation = typeof organisationData === 'string' ? this.organisations.find(org => org.name === organisationData) : organisationData;

    if (organisation.users && organisation.users.length > 0) {
      this.users = organisation.users;
      console.log(' ::>> selectOrg >>>> uers = ', this.users);
    } else {
      this.users = [];
    }
  }

  public selectUser(userData: { name: string; email: string; password: string; role: string; }): void {
    console.log(' ::>> userChanged >>>> ', userData, this.users);
    this.selectedUser = userData;
    this.hideMenu();

    this.element.dispatchEvent(
      new CustomEvent('user-selected', {
        bubbles: true,
        detail: userData
      })
    );
  }
  
  public showMenu(): void {
    this.userSelectionEnabled = true;
  }
  
  public hideMenu(): void {
    this.userSelectionEnabled = false;
  }

  public menuEnter(): void {
    window.clearTimeout(this.menuCloseTimer);
  }

  public menuLeave(): void {
    this.menuCloseTimer = setTimeout(() =>{
      this.userSelectionEnabled = false;
    }, 500);
  }
}
