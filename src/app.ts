import { autoinject } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DataStore } from 'stores/data-store';

import { ICONS } from 'resources/constants/icons';
import { EVENTS } from 'stores/events';

import toastr from 'toastr';

import './assets/styles/globals.scss';
import './assets/styles/aurelia-dialog-overrides.scss';
import './assets/styles/toastr.css';
import './assets/styles/theme.scss';
import './app.scss';
import { AppService } from 'app-service';

@autoinject
export class App {
  public icons = ICONS;
  public router: Router;
  private menuCloseTimer;

  public menu = {
    file: false,
    edit: false,
    view: false,
    help: false,
  };

  public fileConfigurations = [{
    name: 'Admin login',
    icon: 'lock',
    route: 'login'
  }];
  
  public editConfigurations = [{
    name: 'Configure Environments',
    icon: 'server',
    route: 'environments'
  }, {
    name: 'Configure Users',
    icon: 'user',
    route: 'users'
  }, {
    name: 'Configure API Requests',
    icon: 'yandex',
    route: 'api-requests'
  }, {
    name: 'Configure Numbers',
    icon: 'hashtag',
    route: 'numbers'
  }
  // , {
  //   name: 'Configure Browsers',
  //   icon: 'globe',
  //   route: 'browsers'
  // }
  ];

  constructor(
    private eventAggregator: EventAggregator,
    public dataStore: DataStore,
    public appService: AppService
  ) {
    toastr.options = {
      'positionClass': 'toast-top-center',
      'preventDuplicates': true,
      'progressBar': true,
      'escapeHtml': false
    };
    this.eventAggregator.subscribe('toastr:success', message => toastr.success(message, 'Success'));
    this.eventAggregator.subscribe('toastr:error', message => toastr.error(message, 'Error'));
  }

  public activate(): void {
    this.dataStore.initialiseSubscriptions();
  }

  public configureRouter(config, router: Router): void {
    config.title = 'ZaiAutoTests';
    config.options.pushState = true;
    config.map([{
      route: 'login',
      name: 'login',
      moduleId: PLATFORM.moduleName('views/login/login'),
      nav: true,
      title: 'Login',
      auth: false
    }, {
      route: ['', 'studio', 'auth/studio'],
      name: 'studio',
      moduleId: PLATFORM.moduleName('views/studio/studio'),
      title: `Studio`
    }, {
      route: ['test-wizard/:testSuiteId', 'auth/test-wizard/:testSuiteId'],
      name: 'test-wizard',
      moduleId: PLATFORM.moduleName('views/test-creator/test-creator'),
      title: `Studio`
    }, {
      route: ['test-wizard/:testSuiteId/:testId', 'auth/test-wizard/:testSuiteId/:testId'],
      name: 'test-wizard',
      moduleId: PLATFORM.moduleName('views/test-creator/test-creator'),
      title: `Studio`
    }, {
      route: ['users', 'auth/users'],
      name: 'users',
      moduleId: PLATFORM.moduleName('views/users/users'),
      title: `Users`
    }, {
      route: ['view-test-result/:urlstring', 'auth/view-test-result/:urlstring'],
      name: 'view-test-result',
      moduleId: PLATFORM.moduleName('views/view-test-result/view-test-result'),
      title: `Users`
    }, {
      route: ['environments', 'auth/environments'],
      name: 'environments',
      moduleId: PLATFORM.moduleName('views/environment/environment'),
      title: `Environments`
    }, {
      route: ['api-requests', 'auth/api-requests'],
      name: 'api-requests',
      moduleId: PLATFORM.moduleName('views/api-requests/api-requests'),
      title: `API Requests`
    }]);
    this.router = router;
  }

  public home(): void {
    this.router.navigate('');
    this.closeMenus();
  }

  private closeMenus(): void {
    const keys = Object.keys(this.menu);
    keys.forEach(key => this.menu[key] = false);
  }

  public showMenu(menu: string): void {
    const keys = Object.keys(this.menu);
    keys.forEach(key => {
      if (menu === key) {
        this.menu[key] = !this.menu[key];
      } else {
        this.menu[key] = false;
      }
    });
  }

  public menuEnter(): void {
    window.clearTimeout(this.menuCloseTimer);
  }

  public menuLeave(menu: string): void {
    this.menuCloseTimer = setTimeout(() =>{
      this.menu[menu] = false;
    }, 1500);
  }

  public navTo(menu: string, route: string): void {
    this.menu[menu] = false;
    if (route === 'login') {
      this.router.navigate(route);
      return;
    }
    this.router.navigate(route);
  }

  public logout(): void {
    this.eventAggregator.publish(EVENTS.USER_LOGGED_OUT);
  }
}
