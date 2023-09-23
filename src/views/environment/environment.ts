import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

interface IEnvironemnt {
  _id: string;
  name: string;
  url: string;
  token: string;
}

@autoinject
export class Environment {
  
  public environments: any = [];

  constructor(
    private httpClient: HttpClient
  ) {}
  
  public activate(): void {
    console.log(' ::>> binded env ');
    this.getEnvironments();
  }

  private getEnvironments(): void {
    this.httpClient
      .createRequest(`environments`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.environments = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.environments);
        } catch(e) {
          console.log(' > Failed to get environments', e);
        }
      });
  }

  public selectEnvironment(environment: IEnvironemnt) {
    console.log(' ::>> select environment >>>> ', environment);
  }
}
