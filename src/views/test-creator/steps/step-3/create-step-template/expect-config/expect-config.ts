import { inject, containerless, observable } from 'aurelia-framework';

import { ICONS } from 'resources/constants/icons';

import './expect-config.scss';

@containerless()
@inject(Element)
export class ExpectConfig {

  public icons = ICONS;
  public value: string;
  public label: string;
  @observable public requireConfigData: boolean = false;
  public selectedConfigOption: string;

  constructor(
    private element: Element
  ) {}

  public activate(): void {
    
  }

  public select(item) {
    console.log(' ::>>selectedConfigOption >>>> ', item);
    this.selectedConfigOption = item;
  }

  public confirm(): void {
    const model = {
      type: 'expect',
      config: {
        value: this.selectedConfigOption,
        label: this.label
      }
    };
    this.reset();
    console.log(' ::>> model >>>> ', model);
    
    this.element.dispatchEvent(
      new CustomEvent('submit', {
        bubbles: true,
        detail: model
      })
    );
  }

  public cancel(): void {
    this.reset();
    this.element.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        detail: {}
      })
    );
  }

  private reset(): void {
    this.value = '';
    this.label = '';
    this.requireConfigData = false;
    this.selectedConfigOption = '';
  }
}
