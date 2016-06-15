import {inject} from 'aurelia-framework';
import {GNS3Store} from 'backend/gns3-store';

@inject(GNS3Store)
export class Projects {
  constructor(GNS3Store) {
    this.GNS3Store = GNS3Store;
    this.projects = []
  }

  activate() {
    return this.GNS3Store.listProjects()
      .then(projects => this.projects = projects)
  }

  open(project) {
    project.open();
  }

  close(project) {
    project.close();
  }
}
