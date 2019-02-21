import React from 'react';
import ReactDOM from 'react-dom';
import { componentFromStream, createEventHandler } from 'recompose';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import User from './User';
import './observableConfig';
import './styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const App = componentFromStream(prop$ => {
  const { handler, stream } = createEventHandler();
  const value$ = stream.pipe(
    map(e => null),
    startWith('demizhao')
  );

  return combineLatest(prop$, value$).pipe(
    map(([props, value]) => (
      <div className="git">
        <button onClick={handler} type="button" className="btn btn-large btn-info">
          <img className="glyph-icon" src="svg/si-glyph-alien.svg" alt="show me a git"/>
          Show Me A Git
        </button>
        <User user={value} />
      </div>
    ))
  );
});

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
