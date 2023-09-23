import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { UserRegistrationSettings } from './user-registration-settings';
import { EncryptService } from 'services/encrypt-service';
import { IUser } from 'stores/data-store';

@autoinject()
export class AuthenticateService {

  private route = 'http://localhost:9000/';

  constructor(private httpClient: HttpClient) {}

  public authenticate(username: string, password: string): Promise<any> {

    const encryptedPassword = EncryptService.encrypt(password);

    return new Promise((resolve, reject) => {
      this.httpClient.createRequest(this.route + 'auth/login')
        .asPost()
        .withContent({
          username,
          password: encryptedPassword
        })
        .withHeader('Content-Type', 'application/json')
        .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
        .send()
        .then(response => resolve(response))
        .catch(error => reject(error.response));
    });
  }

  public registerUser(
    username: string,
    password: string
  ): Promise<void> {
    return new Promise(resolve => {
      const encryptedPassword = EncryptService.encrypt(password);

      this.httpClient.createRequest(this.route + 'auth/register')
        .asPost()
        .withContent({ username, password: encryptedPassword })
        .withHeader('Content-Type', 'application/json')
        .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
        .send()
        .then((response) => {
          //@ts-ignore
          resolve(response);
        })
        .catch((error) => {
          console.warn(' ::>> error ', error);
        });
    })
  }
}
