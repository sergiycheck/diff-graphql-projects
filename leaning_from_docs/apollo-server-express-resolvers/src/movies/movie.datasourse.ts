import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';

class MoviesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://movies-api.example.com/';
  }

  //intercept fetches
  // protected willSendRequest(request: RequestOptions): void | Promise<void> {
  //   request.headers.set('Authorization', this.context.token);
  // request.params.set('api_key', this.context.token);
  // }

  // resolving urls dynamically
  // async resolveURL(request: RequestOptions) {
  //   if (!this.baseURL) {
  //     const addresses = await resolveSrv(request.path.split("/")[1] + ".service.consul");
  //     this.baseURL = addresses[0];
  //   }
  //   return super.resolveURL(request);
  // }

  async getMovie(id) {
    return this.get(`movies/${encodeURIComponent(id)}`);
  }

  async getMostViewedMovies(limit = 10) {
    const data = await this.get('movies', {
      per_page: limit,
      order_by: 'most_viewed',
    });
    return data.results;
  }

  async postMovie(movie) {
    return this.post(`movies`, movie);
  }

  async newMovie(movie) {
    return this.put(`movies`, movie);
  }

  async updateMovie(movie) {
    return this.patch(`movies`, { id: movie.id, movie });
  }

  async deleteMovie(movie) {
    return this.delete(`movies/${encodeURIComponent(movie.id)}`);
  }
}

export default MoviesAPI;
