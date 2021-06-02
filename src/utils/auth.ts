import bcrypt from 'bcrypt';
import { DataStore } from '../dataStore';

const ROUNDS = 12;
const users = new DataStore();

export class Authentication {
  static async addAccount(username: string, password: string) {
    if (!username || !password) {
      throw new Error('Username and Password must be passed to addAccount()');
    }
    return bcrypt.hash(`${password}-${username}`, ROUNDS).then((hash) => {
      users.set(username, hash);
    });
  }
  static getAccounts() {
    return users.keys();
  }
  static async validate(username: string, password: string) {
    if (users.has(username)) {
      const hash = users.get(username);
      return bcrypt.compare(`${password}-${username}`, hash);
    } else {
      return bcrypt.hash(`${password}-${username}`, ROUNDS).then(() => { return false; });
    }
  }
}