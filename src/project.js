import {inject} from 'aurelia-framework';
import {GNS3Store} from 'backend/gns3-store';

@inject(GNS3Store)
export class Project {
  constructor(GNS3Store) {
    this.GNS3Store = GNS3Store;
    this.project = null;
    this.nodes = [];
    this.links = [];
  }

  activate(params) {
    return this.GNS3Store.getProject(params.id)
      .then(project => this.project = project)
      .then(project => this.project.nodes())
      .then(nodes => this.nodes = nodes)
      .then(nodes => this.project.links())
      .then(links => this.links = links)
  }

  start(node) {
    node.start();
  }

  stop(node) {
    node.stop();
  }
}

