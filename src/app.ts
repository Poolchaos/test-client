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
      route: '',
      name: 'home',
      moduleId: PLATFORM.moduleName('views/home/home'),
      title: `Home`
    }, {
      route: 'studio',
      name: 'studio',
      moduleId: PLATFORM.moduleName('views/studio/studio'),
      title: `Studio`
    }, {
      route: 'test-wizard/:testSuiteId',
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
  }

  public studio(): void {
    this.router.navigate('studio');
  }
}
