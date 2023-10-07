import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { ICONS } from 'resources/constants/icons';
import { DataStore } from 'stores/data-store';

interface IEnvironemnt {
  _id: string;
  name: string;
  url: string;
  token: string;
}

@autoinject
export class APIRequests {
  
  public icons = ICONS;
  public requests: any = [];

  constructor(
    private httpClient: HttpClient,
    public dataStore: DataStore
  ) {}
  
  public activate(): void {
    console.log(' ::>> binded env ');
    this.getRequests();
  }

  private getRequests(): void {
    this.httpClient
      .createRequest('api-requests')
      .asGet()
      .send()
      .then(data => {
        try {
          let requests = JSON.parse(data.response);

          
          console.log(' ::>> requests >>> ', requests);

          requests = requests.map(request => {
            request.headers = Object.entries(request.headers);
            request.queryParams = Object.entries(request.queryParams);
            request.body = Object.entries(request.body);
            return request;
          });

          this.requests = requests;
        } catch(e) {
          console.log(' > Failed to get requests', e);
        }
      });
  }

  public selectRequest(request: IEnvironemnt) {
    console.log(' ::>> select request >>>> ', request);
  }

  public addApiRequest(): void {
    
  }
}
