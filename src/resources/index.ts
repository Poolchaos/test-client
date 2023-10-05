import { PLATFORM } from 'aurelia-pal';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./components/explorer/explorer'),
    PLATFORM.moduleName('./components/welcome/welcome'),
    PLATFORM.moduleName('./components/editor/editor'),
    PLATFORM.moduleName('./components/steps/steps'),
    PLATFORM.moduleName('./components/dots-loader/dots-loader'),
    PLATFORM.moduleName('./components/switch/switch'),
    PLATFORM.moduleName('./components/select-user/select-user'),
  ]);
}
