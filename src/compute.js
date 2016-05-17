import {inject} from 'aurelia-framework';
import {ComputeService} from 'backend/gns3-store';

import {GNS3Store} from 'backend/gns3-store';

@inject(GNS3Store)
export class Compute {
  constructor(GNS3Store) {
    this.GNS3Store = GNS3Store;
    this.compute = null;
  }

  activate(params) {
    return this.GNS3Store.getCompute(params.id)
      .then(compute => this.compute = compute)
  }
}

