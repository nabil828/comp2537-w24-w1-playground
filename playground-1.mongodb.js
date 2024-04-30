use("test")


db.w1users.insertMany([
  {
    username: 'admin',
    password: 'admin',
    type: 'administrator'
  },
  {
    username: 'user1',
    password: 'pass1',
    type: 'non-administrator'
  },
  {
    username: 'user2',
    password: 'pass2',
    type: 'non-administrator'
  }
])