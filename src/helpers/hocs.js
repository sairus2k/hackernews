import React from 'react';

export const withEither = (condition, EitherComponent) => Component => (props) =>
  condition ?
    <EitherComponent /> :
    <Component {...props} />;
