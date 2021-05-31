import bcrypt from 'bcrypt';

const ROUNDS = 12;

const users: Map<string,string> = new Map();
bcrypt.hash('abcdefgh-User1', ROUNDS).then((hash) => {
  users.set('User1', hash);
  console.log(users);
});

export function validate(username: string, password: string) {
  if (users.has(username)) {
    const hash = users.get(username);
    return bcrypt.compare(`${password}-${username}`, hash);
  } else {
    return bcrypt.hash(`${password}-${username}`, ROUNDS).then(() => { return false; });
  }
}