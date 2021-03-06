import {inject} from 'aurelia-framework';
import {Api} from 'backend/api'
import {Model} from 'backend/model'
import {computedFrom} from 'aurelia-framework';


class Compute extends Model {
  properties = ['name'];

  constructor(attrs, api) {
    super(attrs, api);

    this.api_url = "computes/" + this.compute_id
  }
}


class Drawing extends Model {
  constructor(attrs, api) {
    console.log(attrs);
    super(attrs, api);

    this.api_url = "projects/" + this.project_id + "/drawings/" + this.drawing_id
  }
}


class Link extends Model {
  constructor(attrs, api) {
    super(attrs, api);

    this.nodes = [];
    this.api_url = "projects/" + this.project_id + "/links/" + this.link_id
  }

  update(attrs) {
    super.update(attrs);
    if (this.project) {
      if (this.nodes.length == 2) {
        this.project.getNode(this.nodes[0]['node_id'])
          .then(node => this.source_node = node);
        this.project.getNode(this.nodes[1]['node_id'])
          .then(node => this.destination_node = node);
      }
    }
    return this;
  }

  start_capture() {
    this.api.post(this.api_url + "/start_capture");
  }

  stop_capture() {
    this.api.post(this.api_url + "/stop_capture");
  }
}


export class Node extends Model {
  properties = ['name'];

  constructor(attrs, api) {
    super(attrs, api);

    this.api_url = "projects/" + this.project_id + "/nodes/" + this.node_id;
  }

  update(attrs) {
    super.update(attrs);
    this.symbol_url = this.api.baseUrl() + "symbols/" + encodeURIComponent(this.symbol) + "/raw";
    return this;
  }

  start() {
    this.api.post(this.api_url + "/start");
  }

  stop() {
    this.api.post(this.api_url + "/stop");
  }

  @computedFrom('console_type', 'console', 'console_host')
  get console_url() {
    return `${this.console_type}://${this.console_host}:${this.console}`;
  }
}


class Project extends Model {
  constructor(attrs, api) {
    super(attrs, api);

    this._nodes = undefined;
    this._links = undefined;
    this._drawings = undefined;
    var self = this;

    this.api_url = "projects/" + this.project_id;

    // Connection to project notifications and websocket processing
    this.ws = this.api.websocket('projects/' + this.project_id + '/notifications/ws');
    this.ws.onmessage = function (e) {
      var msg = JSON.parse(e.data);

      if (msg["action"] == "ping") {
        return;
      }

      if (msg["action"].startsWith("node.") && self._nodes != undefined ) {
        self._nodes.then(nodes => {

          if (msg["action"] == "node.created") {
            var node = new Node(msg["event"], self.api);
            node.update({'project': self});
            nodes.push(node);
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
      }

      if (msg["action"].startsWith("link.") && self._links != undefined ) {
        self._links.then(links => {

          if (msg["action"] == "link.created") {
            var link = new Link(msg["event"], self.api);
            link.update({'project': self});
            links.push(link);
            return;
          }

          if (msg["action"] == "link.updated") {
            self.getLink(msg["event"]["link_id"]).then(link => link.update(msg["event"]));
            return;
          }

          if (msg["action"] == "link.deleted") {
            self.getLink(msg["event"]["link_id"]).then(link => links.splice(links.indexOf(link), 1));
            return;
          }
        });
      }

       if (msg["action"].startsWith("drawing.") && self._drawings != undefined ) {
        self._drawings.then(drawings => {

          if (msg["action"] == "drawing.created") {
            var drawing = new Drawing(msg["event"], self.api);
            drawing.update({'project': self});
            drawings.push(drawing);
            return;
          }

          if (msg["action"] == "drawing.updated") {
            self.getDrawing(msg["event"]["drawing_id"]).then(drawing => drawing.update(msg["event"]));
            return;
          }

          if (msg["action"] == "drawing.deleted") {
            self.getDrawing(msg["event"]["drawing_id"]).then(drawing => drawings.splice(drawings.indexOf(drawing), 1));
            return;
          }
        });
      }
    };
  }

  getLink(link_id) {
    return this.links()
      .then(links => links.find(link => link["link_id"] == link_id ));
  }

  getDrawing(drawing_id) {
    return this.drawings()
      .then(drawings => drawings.find(drawing => drawing["drawing_id"] == drawing_id ));
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

  drawings() {
    if (this._drawings == undefined) {
      this._drawings = this.list('projects/' + this.project_id + '/drawings', Drawing)
        .then(drawings => drawings.map(drawing => drawing.update({'project': this})));
    }
    return this._drawings;
  }

  open() {
    this.api.post(this.api_url + "/open");
  }

  close() {
    this.api.post(this.api_url + "/close");
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
