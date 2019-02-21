import React from 'react';
import { componentFromStream } from 'recompose';
import { merge, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  pluck,
  switchMap,
  publishReplay,
  refCount

} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import Error from '../Error';
import Component from './Component';
import './User.css';

const formatUrl = user => user ? `https://api.github.com/users/${user}` : 'https://api.github.com/users';
const getRandomUser = users => Array.isArray(users)? users[Math.floor(Math.random()*users.length)] : users;

const User = componentFromStream(prop$ => {
  const loading$ = of(<h4>Loading...</h4>);

  const getUser$ = prop$.pipe(
    debounceTime(1000),
    pluck('user'),
    map(formatUrl),
    switchMap(url =>
      merge(
        loading$,
        ajax(url).pipe(
          publishReplay(),
          refCount(2),
          pluck('response'),
          map(getRandomUser),
          map(Component),
          catchError(error => of(<Error {...error} />))
        )
      )
    )
  );

  return getUser$;
});

export default User;
