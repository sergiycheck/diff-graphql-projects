import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

const uri = 'http://localhost:4080/graphql';

const linkChain = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
}).concat(new HttpLink({ uri }));

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: linkChain,
});

const GET_CACHED_BOOK = gql`
  query CachedBook {
    cachedBook {
      title
      cachedTitle
    }
  }
`;

client
  .query({ query: GET_CACHED_BOOK })
  .then((results: any) => console.log('results', results));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
