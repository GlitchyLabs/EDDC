import { DataStore } from '../src/dataStore';

describe('DataStore', () => {
  it('should load', () => {
    expect(new DataStore).toBeDefined();
  });
  describe('and', () => {
    let dataStore: DataStore;
    beforeEach(() => {
      dataStore = new DataStore();
    });
    it('should be able to set/get values', () => {
      expect(() => dataStore.set('test', 'value')).not.toThrow();
      expect(dataStore.get('test')).toBe('value');
    });
    it('should throw a fit if you don\'t pass a key to get()', () => {
      // @ts-expect-error
      expect(() => dataStore.get()).toThrow();
    });
    it('should throw a fit if you don\'t pass a key to set()', () => {
      expect(() => dataStore.set(undefined, 'value')).toThrow();
    });
    it('should throw a fit if you don\'t pass a value to set()', () => {
      // @ts-expect-error
      expect(() => dataStore.set('test')).toThrow();
    });
  });
});