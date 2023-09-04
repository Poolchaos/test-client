import { autoinject } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ICONS } from 'resources/constants/icons';

import toastr from 'toastr';

import './resources/styling/globals.scss';
import './resources/styling/aurelia-dialog-overrides.scss';
import './resources/styling/toastr.css';
import './app.scss';

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
  
  public configurations = [{
    name: 'Configure Environments',
    icon: 'server',
    route: 'environments'
  }, {
    name: 'Configure Users',
    icon: 'user',
    route: 'users'
  }, {
    name: 'Configure Numbers',
    icon: 'hashtag',
    route: 'numbers'
  }, {
    name: 'Configure Browsers',
    icon: 'globe',
    route: 'browsers'
  }];

  constructor(
    private eventAggregator: EventAggregator
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

  public configureRouter(config, router: Router): void {
    config.title = 'ZaiAutoTests';
    config.options.pushState = true;
    config.map([{
      route: ['', 'studio'],
      name: 'studio',
      moduleId: PLATFORM.moduleName('views/studio/studio'),
      title: `Studio`
    }, {
      route: 'test-wizard/:testSuiteId',
      name: 'test-wizard',
      moduleId: PLATFORM.moduleName('views/test-creator/test-creator'),
      title: `Studio`
    }, {
      route: 'test-wizard/:testSuiteId/:testId',
      name: 'test-wizard',
      moduleId: PLATFORM.moduleName('views/test-creator/test-creator'),
      title: `Studio`
    }, {
      route: 'users',
      name: 'users',
      moduleId: PLATFORM.moduleName('views/users/users'),
      title: `Users`
    }, {
      route: 'view-test-result/:urlstring',
      name: 'view-test-result',
      moduleId: PLATFORM.moduleName('views/view-test-result/view-test-result'),
      title: `Users`
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
    this.router.navigate(route);
  }
}
