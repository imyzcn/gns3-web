import {inject} from 'aurelia-framework';
import {GNS3Store} from 'backend/gns3-store';

@inject(GNS3Store)
export class Computes {
  constructor(GNS3Store) {
    this.GNS3Store = GNS3Store;
    this.computes = []
  }

  activate() {
    return this.GNS3Store.listComputes()
      .then(computes => this.computes = computes)
  }

  delete(node) {
    node.delete();
  }
}
