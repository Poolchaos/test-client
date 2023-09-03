import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ICONS } from './../../constants/icons';

import './welcome.scss';

@autoinject
export class Welcome {
  public icons = ICONS;
  
  public callToActions = [{
    name: 'Configure Environments',
    icon: 'server'
  }, {
    name: 'Configure Users',
    icon: 'user'
  }, {
    name: 'Configure Numbers',
    icon: 'hashtag'
  }, {
    name: 'Configure Browsers',
    icon: 'globe'
  }];
  
  public interactions = [{
    name: 'Managing Interactions',
    icon: 'gear'
  }, {
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
    if (action === 'Configure Users') {
      this.router.navigate('users');
    }
  }
}
