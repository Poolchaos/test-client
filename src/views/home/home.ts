import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import './home.scss';

@autoinject
export class Home {

  constructor(
    private router: Router
  ) {}

  public startUpStudio(): void {
    this.router.navigate('studio')
  }
}
