import { inject, containerless, observable } from 'aurelia-framework';

import { ICONS } from 'resources/constants/icons';

import './click-config.scss';

@containerless()
@inject(Element)
export class ClickConfig {

  public icons = ICONS;
  public value: string;
  public label: string;

  constructor(
    private element: Element
  ) {}

  public activate(): void {
    
  }

  public confirm(): void {
    const model = {
      type: 'click',
      config: {
        value: this.value,
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
  }
}
