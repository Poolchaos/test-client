import {ValidationRenderer, RenderInstruction, ValidateResult} from 'aurelia-validation';
/*
 * */
export class BootstrapFormRenderer {

  warningClass = 'has-warning';

  render(instruction) {

    this._removeValidation(instruction.unrender);
    this._addValidation(instruction.render);
  }

  _removeValidation(unrender) {
    for (let {elements} of unrender) {
      for (let element of elements) {
        this.removeValidation(element);
      }
    }
  }
  _addValidation(render) {
    for (let {result, elements} of render) {
      for (let element of elements) {
        this.addValidation(element, result);
      }
    }
  }

  addValidation(element, result) {
    if (result.valid) {
      return;
    }
    this._addWarningClass(element);
    this._addElementToDom(element, result);
  }

  _addWarningClass(element) {
    element.parentNode.classList.add(this.warningClass);
  }

  _addElementToDom(element, result) {

    let paragraph = this._findOrCreateParagraph(element);
    let content = document.createElement('span');
    content.textContent = result.message + ' ';
    paragraph.appendChild(content);

    if(!this._addedToContainer(element, paragraph)) {
      element.parentNode.insertBefore(paragraph, element.nextSibling);
    }
  }

  _findOrCreateParagraph(element) {

    const paragraph = element.parentNode.getElementsByClassName('js-validation-item');

    if(paragraph && paragraph[0]) {
      return paragraph[0];
    }

    const newParagraph = document.createElement('p');
    newParagraph.className = 'js-validation-item help-block aurelia-validation-message';
    return newParagraph;
  }

  _addedToContainer(element, message) {
    let container = element.parentNode.querySelector('.js-validation');
    if(container) {
      container.appendChild(message);
      return true;
    }
    return false;
  }

  removeValidation(element) {
    this._removeFromContainer(element);
    this._removeWarningClass(element);
  }

  _removeWarningClass(element) {
    element.parentNode.classList.remove(this.warningClass);
  }

  _removeFromContainer(element) {
    let validation = element.parentNode.getElementsByClassName('js-validation-item');
    if(validation && validation.length) {
      for(let i = validation.length - 1; i >= 0; i--) {
        validation[i].parentNode.removeChild(validation[i]);
      }
    }
  }
}