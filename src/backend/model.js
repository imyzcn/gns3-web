export class Model {
  // JSON schema of properties that we can modify
  properties = {};

  constructor(attrs, api) {
    this.api = api;

    this.update(attrs);
  }

  /*
   * Update object data from outside (GNS3 server)
   */
  update(attrs) {
    this.original_data = attrs;
    for (var attr in attrs) {
      this[attr] = attrs[attr];
    }
    return this;
  }


  delete() {
    this.api.delete(this.api_url);
  }

  /**
   * List elements
   *
   * endpoint: API endpoint
   * model: Class of element
   *
   * Return promise
   */
  list(endpoint, model) {
    return this.api.get(endpoint)
      .then(elements => elements.map(e => new model(e, this.api)))
  }

  save() {
    var body = {};
    this.properties.forEach(p => body[p] = this[p]);
    this.api.put(this.api_url, body);
  }
}

