import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CookieService } from 'services/cookie-service';
import { EVENTS } from './events';

@autoinject()
export class DataStore {

  private USER: ILogin | IUser;

  constructor(
    private eventAggregator: EventAggregator,
    private cookieService: CookieService
  ) {
    this.initialiseSubscriptions();
  }

  private dataUpdated(event: string, data?: any): void {
    this.eventAggregator.publish(event, data);
  }

  private initialiseSubscriptions(): void {
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_IN, (data: ILogin) => this.user = data);
    this.eventAggregator.subscribe(EVENTS.USER_REHYDRATE, (data: IUser) => this.user = data);
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_OUT, (data: IUser) => this.user = data);
  }

  public set user(user: ILogin | IUser) {
    this.USER = user;
    if (user) {
      this.cookieService.setCookie(EVENTS.CACHE.USER, JSON.stringify(user), 3);
    } else {
      this.cookieService.eraseCookie(EVENTS.CACHE.USER);
    }
    this.dataUpdated(EVENTS.USER_UPDATED);
  }

  @computedFrom('USER')
  public get user(): ILogin | IUser {
    return this.USER;
  }

  @computedFrom('USER.role')
  public get isAdmin(): boolean {
    return this.USER ? this.USER.role === EVENTS.ROLES.ADMIN : false;
  }
}

export interface ILogin {
  _id: string;
  token: string;
  role: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  token: string;
  number: string;
  role: string;
  permissions: boolean;
}
