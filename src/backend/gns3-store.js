import {inject} from 'aurelia-framework';
import {Api} from 'backend/api'
import {Model} from 'backend/model'
import {computedFrom} from 'aurelia-framework';


class Compute extends Model {
  constructor(attrs, api) {
    super(attrs, api);
  }
}


class Link extends Model {
  update(attrs) {
    super.update(attrs);
    if (this.project) {
      this.project.getNode(this.nodes[0]['node_id'])
        .then(node => this.source_node = node);
      this.project.getNode(this.nodes[1]['node_id'])
        .then(node => this.destination_node = node);
    }
    return this;
  }
}


export class Node extends Model {
  properties = ['name'];

  constructor(attrs, api) {
    super(attrs, api);
    // Fake X position
    this["x"] = Math.floor((Math.random() * 200));

    this.api_url = "projects/" + this.project_id + "/nodes/" + this.node_id
  }

  start() {
    this.api.post(this.api_url + "/start");
  }

  stop() {
    this.api.post(this.api_url + "/stop");
  }

  @computedFrom('console_type', 'console')
  get console_url() {
    return `${this.console_type}://localhost:${this.console}`;
  }
}


class Project extends Model {
  constructor(attrs, api) {
    super(attrs, api);

    this._nodes = undefined;
    var self = this;

    // Connection to project notifications and websocket processing
    this.ws = this.api.websocket('projects/' + this.project_id + '/notifications/ws');
    this.ws.onmessage = function (e) {
      var msg = JSON.parse(e.data);

      if (self._nodes == undefined || msg["action"] == "ping") {
        return;
      }

      self._nodes.then(nodes => {

        if (msg["action"] == "node.created") {
          nodes.push(new Node(msg["event"], self.api));
          return;
        }

        if (msg["action"] == "node.updated") {
          self.getNode(msg["event"]["node_id"]).then(node => node.update(msg["event"]));
          return;
        }

        if (msg["action"] == "node.deleted") {
          self.getNode(msg["event"]["node_id"]).then(node => nodes.splice(nodes.indexOf(node), 1));
          return;
        }
      });
    };
  }

  getNode(node_id) {
    return this.nodes()
      .then(nodes => nodes.find(node => node["node_id"] == node_id ));
  }

  nodes() {
    if (this._nodes == undefined) {
      this._nodes = this.list('projects/' + this.project_id + '/nodes', Node)
        .then(nodes => nodes.map(node => node.update({'project': this})));
    }
    return this._nodes;
  }

  links() {
    if (this._links == undefined) {
      this._links = this.list('projects/' + this.project_id + '/links', Link)
        .then(links => links.map(link => link.update({'project': this})));
    }
    return this._links;
  }
}


@inject(Api)
export class GNS3Store {

  constructor(Api) {
    this.api = Api;
    this.projects = {};
  }

  listProjects() {
    return this.api.get('projects')
        .then(elements => elements.map(e => this.cacheProject(e)));
  }

  getProject(id) {
    return this.api.get('projects/' + id)
        .then(project => this.cacheProject(project));
  }

  /**
   * Get a project object and cache it
   */
  cacheProject(data) {
    if (this.projects[data.project_id] == undefined) {
      this.projects[data.project_id] = new Project(data, this.api);
    }
    else {
      this.projects[data.project_id].update(data);
    }
    return this.projects[data.project_id]
  }

  listComputes() {
    return this.api.get('computes')
      .then(elements => elements.map(e => new Compute(e, this.api)));
  }

  getCompute(id) {
    return this.api.get('computes/' + id)
      .then(element => new Compute(element, this.api));
  }
}
