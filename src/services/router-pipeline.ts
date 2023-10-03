import { autoinject } from 'aurelia-framework';
import { Redirect, NavigationInstruction } from 'aurelia-router';
import { DataStore } from 'stores/data-store';

@autoinject()
export class AuthRouteStep {

  constructor(
    private dataStore: DataStore
  ) {}

  run(navigationInstruction: NavigationInstruction, next: any) {
    let user = this.dataStore.user;
    
    if (!user) {
      if(navigationInstruction.fragment.indexOf('auth/') >= 0) {
        const authRoute = navigationInstruction.fragment.replace('auth/', '');
        return next.cancel(new Redirect(authRoute));
      }
      return next();
    } else if (user) {
      if(navigationInstruction.fragment.indexOf('auth/') >= 0) {
        return next();
      }
      const authRoute = 'auth/' + navigationInstruction.fragment.replace('/', '');
      return next.cancel(new Redirect(authRoute));
    }
    return next();
  }
}
