import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Locations from '../locations/locations';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="locations"
          element={
            <section>
              <Locations />
            </section>
          }
        />

        <Route
          path="other"
          element={
            <section>
              <OtherElement />
            </section>
          }
        ></Route>
      </Routes>
    </div>
  );
}

function NavBar() {
  return (
    <div className="navBar">
      <nav>
        <Link className="App-link" to="/">
          home
        </Link>
      </nav>
      <nav>
        <Link className="App-link" to="/locations">
          locations
        </Link>
      </nav>
      <nav>
        <Link className="App-link" to="/other">
          other
        </Link>
      </nav>
    </div>
  );
}

function Home() {
  return (
    <header className="App-header">
      <h2>Apollo client app</h2>
    </header>
  );
}

function OtherElement() {
  return <h2>other element</h2>;
}
