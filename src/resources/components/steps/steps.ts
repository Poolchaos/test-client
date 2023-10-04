import { Router } from 'aurelia-router';
import { bindable, autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ICONS } from 'resources/constants/icons';

import './steps.scss';

@autoinject
export class Steps {
  @bindable({ attribute: 'test-suite-id' }) public testSuiteId: string;
  @bindable({ attribute: 'test-id' }) public testId: string;
  @bindable({ attribute: 'disable-delete' }) public disableDelete: boolean;
  @bindable({ attribute: 'disable-reorder' }) public disableReorder: boolean;
  @bindable public steps: any[] = [];
  @bindable public editable: boolean;
  @bindable public deletable: boolean;

  public sortableList: HTMLUListElement;

  public icons = ICONS;

  constructor(
    private router: Router,
    private eventAggregator: EventAggregator
  ) {}

  public attached(): void {
    this.setupDragAndDrop();
  }

  private setupDragAndDrop(): void {
    const sortableList = this.sortableList;

    if (!sortableList) {
      setTimeout(() =>  setTimeout(() => this.setupDragAndDrop()), 500);
      return;
    }
    console.log(' ::>> sortable list found ');

    const items = sortableList.querySelectorAll('.draggable-item');
    let draggedItem = null;

    items.forEach(item => {
      item.addEventListener('dragstart', (e: any) => {
        draggedItem = item;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', item.innerHTML);
      });
    });

    sortableList.addEventListener('dragover', (e: any) => {
      e.preventDefault();
      const target = e.target.closest('.draggable-item');
      if (target && target !== draggedItem) {
        sortableList.insertBefore(draggedItem, target);
      }
    });

    sortableList.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedItem) {
        draggedItem = null;
        this.updateItemIndexes();
      }
    });
  }

  public updateItemIndexes(): void {
    const items: any = this.sortableList.querySelectorAll('.draggable-item');
    let reorderedList = [];
    items.forEach((item, index) => {
      reorderedList[index] = this.steps.find(step => step.id === item.id);
    });
    this.steps = reorderedList;
  }
  
  public deleteStepGroup = (group: { groupId: string }): void => {
    this.steps = this.steps.filter(step => step.groupId !== group.groupId);
  }
  
  public deleteStep = (index: number): void => {
    console.log(' ::>> deleteStep >>>> ', index);
    this.steps.splice(index, 1);
  }

  public editTestSuite(): void {
    this.router.navigate('test-wizard/' + this.testSuiteId + '/' + this.testId);
  }
}
