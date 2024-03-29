import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';

import { ICONS } from 'resources/constants/icons';
import { EnvironmentDialog } from './add-environment-dialog/environment-dialog';
import { EnvironmentService } from './environment-service';
import { ConfirmDialog } from 'resources/components/_dialogs/confirm-dialog/confirm-dialog';
import { DataStore } from 'stores/data-store';

interface IEnvironemnt {
  _id: string;
  name: string;
  url: string;
  token: string;
}

@autoinject
export class Environment {
  
  public icons = ICONS;
  public environments: any = [];

  constructor(
    private dialogService: DialogService,
    private environmentService: EnvironmentService,
    public dataStore: DataStore
  ) {}
  
  public activate(): void {
    console.log(' ::>> binded env ', this.dataStore);
    this.getEnvironments();
  }

  private getEnvironments(): void {
    this.environmentService
      .getEnvironments()
      .then(data => {
        try {
          this.environments = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.environments);
        } catch(e) {
          console.log(' > Failed to get environments', e);
        }
      });
  }

  public hoverEnvironment(env: any): void {
    if (!this.dataStore.user) {
      return;
    }
     env.isHovering = true
  }

  public hoverOffEnvironment(env: any): void {
    if (!this.dataStore.user) {
      return;
    }
     env.isHovering = false
  }

  public addEnvironment(): void {
    this.dialogService
      .open({ viewModel: EnvironmentDialog })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          console.log(' ::>> response.output >>>> ', response.output);
          this.environments.push(response.output);
        }
      });
  }

  public showConfirmDeleteEnvironment(environment: IEnvironemnt) {
    if (!this.dataStore.user) {
      return;
    }
    this.dialogService
      .open({ viewModel: ConfirmDialog, model: 'This will delete your environment: ' + environment.name })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.deleteEnvironment(environment);
        }
      });
  }

  private deleteEnvironment(environment: { _id }): void {
    this.environmentService
      .deleteEnvironment(environment._id)
      .then(() => this.getEnvironments())
      .catch(e => console.warn('Failed to delete environment due to', e));
  }
}
