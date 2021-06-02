import { Authentication } from '../../src/utils/auth';

describe('Authentication', () => {
  it('should exist', () => {
    expect(Authentication).toBeDefined();
  });
  it('should add a user', async () => {
    await Authentication.addAccount('test','1234');
    expect(Array.from(Authentication.getAccounts()).length).toBeGreaterThan(0);
  });
  it('should get a list of users', async () => {
    await Authentication.addAccount('test2','1234');
    const users = Array.from(Authentication.getAccounts());
    expect(users).toContain('test');
    expect(users).toContain('test2');
  });
  it('should throw a fit if you don\'t pass a username to addAccount()', async () => {
    await expect(Authentication.addAccount(undefined, '12345')).rejects.toThrow();
  });
  it('should throw a fit if you don\'t pass a password to addAccount()', async () => {
    await expect(Authentication.addAccount('user', undefined)).rejects.toThrow();
  });
  it('should pass validation with correct password', async () => {
    expect(await Authentication.validate('test', '1234')).toBeTruthy();
  });
  it('should fail validation with incorrect password', async () => {
    expect(await Authentication.validate('test', '2345')).toBeFalsy();
  });
  it('should fail validation with invalid username', async () => {
    expect(await Authentication.validate('bogus', '1234')).toBeFalsy();
  });
});