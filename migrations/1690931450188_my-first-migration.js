/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(255)', notNull: true },
    password: { type: 'varchar(255)', notNull: true }
  })
  pgm.createTable('activities', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true }
  })
  pgm.createTable('routines', {
    id: { type: 'serial', primaryKey: true },
    creatorId: { type: 'integer', references: "users(id)" },
    isPublic: { type: 'boolean', default: false },
    name: { type: 'varchar(255)', notNull: true },
    goal: { type: 'text', notNull: true }
  })
  pgm.createTable('routine_activities', {
    id: { type: 'serial', primaryKey: true },
    routineId: { type: 'integer', references: "routines(id)" },
    activityId: { type: 'integer', references: "activities(id)" },
    duration: { type: 'integer' },
    count: { type: 'integer' }
  })
  pgm.addConstraint('routine_activities',
    "routine_activities_unique_constraint",
    'UNIQUE ("routineId", "activityId")');
  pgm.addConstraint('users',
    "users_unique_constraint",
    'UNIQUE username');
};

exports.down = pgm => {
  pgm.dropTable('routine_activities')
  pgm.dropTable('routines')
  pgm.dropTable('activities')
  pgm.dropTable('users')
};
