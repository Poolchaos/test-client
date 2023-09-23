import { Router } from 'aurelia-router';
import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CookieService } from 'services/cookie-service';
import { EVENTS } from './events';

@autoinject()
export class DataStore {

  private USER: ILogin | IUser;

  constructor(
    private eventAggregator: EventAggregator,
    private cookieService: CookieService,
    private router: Router
  ) {}

  private dataUpdated(event: string, data?: any): void {
    console.log(' ::>> trigger event >>>> ', event);
    this.eventAggregator.publish(event, data);
  }

  public initialiseSubscriptions(): void {

    let user = JSON.parse(this.cookieService.getCookie(EVENTS.CACHE.USER));
    if (!user || user === 'null') {
      console.log(' ::>> no user >>>> ');
      const currentInstruction = this.router.currentInstruction;
      if (currentInstruction && currentInstruction.fragment.includes('auth')) {
        console.log('The current route contains "auth".');
        this.router.navigate(currentInstruction.fragment.replace('auth/', ''));
      }
    } else {
      this.USER = user;
    }
    
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_IN, (data: ILogin) => this.user = data);
    this.eventAggregator.subscribe(EVENTS.USER_REHYDRATE, (data: IUser) => this.user = data);
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_OUT, (data: IUser) => this.user = data);
  }

  public set user(user: ILogin | IUser) {
    this.USER = user;
    if (user) {
      console.log(' ::>> setting user data >>>> ', user);
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
