import {inject} from 'aurelia-framework';
import {GNS3Store} from 'backend/gns3-store';

@inject(GNS3Store)
export class Node {
  constructor(GNS3Store) {
    this.GNS3Store = GNS3Store;
    this.node = null;
    this.project = null;
  }

  activate(params) {
    this.GNS3Store.getProject(params.project_id)
      .then(project => this.project = project)
      .then(project => project.getNode(params.node_id))
      .then(node => this.node = node)
  }

  save() {
    this.node.save();
  }
}

