import {bindable, bindingMode} from 'aurelia-framework';

export class Topology {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) nodes;

}
