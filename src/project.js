import {inject} from 'aurelia-framework';
import {GNS3Store} from 'backend/gns3-store';

@inject(GNS3Store)
export class Project {
  constructor(GNS3Store) {
    this.GNS3Store = GNS3Store;
    this.project = null;
    this.nodes = [];
    this.links = [];
    this.drawings = [];
  }

  activate(params) {
    return this.GNS3Store.getProject(params.id)
      .then(project => this.project = project)
      .then(project => this.project.nodes())
      .then(nodes => this.nodes = nodes)
      .then(nodes => this.project.links())
      .then(links => this.links = links)
      .then(links => this.project.drawings())
      .then(drawings => this.drawings = drawings)
  }

  start(node) {
    node.start();
  }

  stop(node) {
    node.stop();
  }

  start_capture(link) {
    link.start_capture();
  }

  stop_capture(link) {
    link.stop_capture();
  }
}

