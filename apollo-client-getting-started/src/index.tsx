import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

import "./index.css";
import App from "./components/app/App";
import reportWebVitals from "./reportWebVitals";

const baseUri = "https://flyby-gateway.herokuapp.com/";

const client = new ApolloClient({
  uri: baseUri,
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query Query {
        locations {
          id
          name
          description
          photo
          overallRating
          reviewsForLocation {
            id
            comment
            rating
          }
        }
      }
    `,
  })
  .then((results) => console.log(results));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
