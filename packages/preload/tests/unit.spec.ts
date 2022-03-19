import {createHash} from 'crypto';
import {afterEach, expect, test, vi} from 'vitest';
import {homedir} from 'node:os';


const exposeInMainWorldMock = vi.fn();
vi.mock('electron', () => ({
  contextBridge: {exposeInMainWorld: exposeInMainWorldMock},
}));


afterEach(() => {
  vi.clearAllMocks();
});


test('versions', async () => {
  await import('../src/versions');
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock).lastCalledWith('versions', process.versions);
});


test('nodeCrypto', async () => {
  await import('../src/nodeCrypto');
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock.mock.calls[0][0]).toBe('nodeCrypto');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('sha256sum');

  const data = 'rawData';
  const expectedHash = createHash('sha256')
    .update(data)
    .digest('hex');

  expect(exposeInMainWorldMock.mock.calls[0][1].sha256sum(data)).toBe(expectedHash);
});


test('fs-api', async () => {
  await import('../src/fs-api');
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock.mock.calls[0][0]).toBe('fsApi');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('homedir');

  expect(exposeInMainWorldMock.mock.calls[0][1].homedir).toBe(homedir());
});
