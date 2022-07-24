import React from 'react';
import Locations from '../locations/locations';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Apollo client app</h2>
      </header>

      <section>
        <article>
          <Locations />
        </article>
      </section>
    </div>
  );
}

export default App;
