import { PLATFORM } from 'aurelia-pal';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./step-1/creator-step-one'),
    PLATFORM.moduleName('./step-3/creator-step-three'),

    PLATFORM.moduleName('./step-3/create-step-template/text-config/text-config'),
    PLATFORM.moduleName('./step-3/create-step-template/click-config/click-config'),
    PLATFORM.moduleName('./step-3/create-step-template/expect-config/expect-config'),
  ]);
}
