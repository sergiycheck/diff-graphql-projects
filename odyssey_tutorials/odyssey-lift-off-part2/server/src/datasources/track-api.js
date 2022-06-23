const { RESTDataSource } = require('apollo-datasource-rest');
const endpoints = require('../endpoints');

class TrackAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = endpoints.base;
  }

  getTracksForHome() {
    console.log('getTracksForHome ');
    return this.get('tracks');
  }

  getAuthor(authorId) {
    console.log('getAuthor ', authorId);

    return this.get(`author/${authorId}`);
  }
}

module.exports = TrackAPI;
