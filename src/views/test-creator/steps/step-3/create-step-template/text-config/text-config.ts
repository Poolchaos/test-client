import { inject, containerless, observable } from 'aurelia-framework';

import { ICONS } from 'resources/constants/icons';

import './text-config.scss';

@containerless()
@inject(Element)
export class TextConfig {

  public icons = ICONS;
  public value: string;
  public label: string;
  @observable public requireConfigData: boolean = false;
  public selectedConfigOption: string;

  public configureOptions = [{
    name: 'User',
    icon: 'user',
    options: [
      { name: 'email', icon: 'envelope', selected: false },
      { name: 'password', icon: 'lock', selected: false },
    ]
  }];

  constructor(
    private element: Element
  ) {}

  public activate(): void {
    
  }

  public requireConfigDataChanged = (): void => {
    console.log(' ::>> requireConfigDataChanged >>>>> ', this.requireConfigData, this.configureOptions)
    if (!this.requireConfigData) {
      this.configureOptions.forEach(option => {
        console.log(' ::>> option >>>> ', option)
        option.options.forEach(_option => _option.selected = false);
      });
      this.selectedConfigOption = null;
      this.value = '';
    }
  }

  public selectSubOption(subOption, option): void {
    option.options.forEach(_option => _option.selected = false);
    subOption.selected = true;
    this.selectedConfigOption = subOption.name;

    if (subOption.name === 'email') {
      this.value = '{{ email }}';
    } else if (subOption.name === 'password') {
      this.value = '{{ password }}';
    }
  }

  public confirm(): void {
    const model = {
      type: 'text',
      predefined: this.requireConfigData,
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
    this.requireConfigData = false;
    this.selectedConfigOption = '';
  }
}
