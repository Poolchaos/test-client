import { PLATFORM } from 'aurelia-pal';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./step-1/creator-step-one'),
    PLATFORM.moduleName('./step-2/creator-step-two'),
    PLATFORM.moduleName('./step-3/creator-step-three'),
  ]);
}
