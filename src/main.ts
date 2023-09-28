import {Aurelia} from 'aurelia-framework';
import environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
      config.useDefaults();
      config.settings.ignoreTransitions = true;
      config.settings.startingZIndex = 9999;
    })
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .feature(PLATFORM.moduleName('resources/index'))
    .feature(PLATFORM.moduleName('views/test-creator/steps/index'))
    .plugin(PLATFORM.moduleName('aurelia-configuration'), config => {
      config.setEnvironments({
        'local': ['localhost:8080'],
        'dev1': ['zai-test-client.kube.api.dev1.zailab.com']
      });
    });

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
