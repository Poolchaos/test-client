import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ICONS } from './../../constants/icons';

import './welcome.scss';

@autoinject
export class Welcome {
  public icons = ICONS;
  
  // public configurations = [{
  //   name: 'Configure Environments',
  //   icon: 'server'
  // }, {
  //   name: 'Configure Organisations',
  //   icon: 'organisation'
  // }, {
  //   name: 'Configure Users',
  //   icon: 'user'
  // }];
  
  public interactions = [{
    name: 'Calls',
    icon: 'phone'
  }, {
    name: 'Emails',
    icon: 'envelope'
  }, {
    name: 'SMS',
    icon: 'sms'
  }, {
    name: 'Chat',
    icon: 'chat'
  }, {
    name: 'WhatsApp',
    icon: 'whatsapp'
  }];

  constructor(
    private router: Router
  ) {}

  public runConfig(action): void {
    console.log(' ::>> action >>>> ', action)
    if (
      action === 'Configure Organisations' ||
      action === 'Configure Users'
    ) {
      this.router.navigate('users');
    } else if (
      action === 'Configure Environments'
    ) {
      this.router.navigate('environments');
    }
  }
}
