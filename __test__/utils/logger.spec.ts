import logger from '../../src/utils/logger';

describe('Logger', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should exist', () => {
    expect(logger).toBeDefined();
  });
  it('should log debug level if DEBUG is true in env', async () => {
    process.env.DEBUG = 'true';
    const logger = (await import('../../src/utils/logger')).default;
    // @ts-expect-error
    const transport = logger.transports.find((transport) => transport.name === 'console' );
    expect(transport).toBeDefined;
    expect(transport.level).toEqual('debug');
  });
  it('should log silly level if DEBUG is true in env and LOG_LEVEL is SILLY', async () => {
    process.env.DEBUG = 'true';
    process.env.LOG_LEVEL = 'silly';
    const logger = (await import('../../src/utils/logger')).default;
    // @ts-expect-error
    const transport = logger.transports.find((transport) => transport.name === 'console' );
    expect(transport).toBeDefined;
    expect(transport.level).toEqual('silly');
  });
  it('should log a message with format', async () => {
    // @ts-expect-error
    const logSpy = jest.spyOn(global.console._stdout, 'write').mockImplementation();
    const logger = (await import('../../src/utils/logger')).default;
    await logger.info('test');
    expect(logSpy).toBeCalled();
    logSpy.mockRestore();
  });
});