const { RESTDataSource } = require('apollo-datasource-rest');
const endpoints = require('../endpoints');

class TrackAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = endpoints.base;
  }

  getTracksForHome() {
    return this.get('tracks');
  }

  getAuthor(authorId) {
    return this.get(`author/${authorId}`);
  }
}

module.exports = TrackAPI;
