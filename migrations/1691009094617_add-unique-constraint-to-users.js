/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addConstraint('users',
    'users_unique_constraint',
    'UNIQUE(username)');
};

exports.down = pgm => {
  pgm.dropConstraint('users',
    'users_unique_constraint');
};
