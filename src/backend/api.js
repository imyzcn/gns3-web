import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Api {
  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(this.baseUrl());
    });
    this.http = http;
  }

  baseUrl() {
    return 'http://localhost:3080/v2/'
  }

  websocket(path) {
    return new WebSocket('ws://localhost:3080/v2/' + path)
  }

  get(path) {
    return this.http.fetch(path)
      .then(response => {
        return response.json();
      });
  }

  post(path) {
    return this.http.fetch(path, {method: 'post'})
      .then(response => {
        if (response.status == 204) {
          return {}
        }
        return response.json();
      });
  }

  put(path, body) {
    return this.http.fetch(path, {method: 'put', body: json(body)})
  }

  delete(path) {
    return this.http.fetch(path, {method: 'delete'})
      .then(response => {
        if (response.status == 204) {
          return {}
        }
        return response.json();
      });
  }
}

