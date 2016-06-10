import {bindable, bindingMode} from 'aurelia-framework';

export class Topology {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) nodes;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) links;

}
