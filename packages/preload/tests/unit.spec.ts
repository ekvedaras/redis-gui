import {afterEach, expect, test, vi} from 'vitest';
import {homedir} from 'node:os';


const exposeInMainWorldMock = vi.fn();
vi.mock('electron', () => ({
  contextBridge: {exposeInMainWorld: exposeInMainWorldMock},
}));


afterEach(() => {
  vi.clearAllMocks();
});


test('fs-api', async () => {
  await import('../src/fs-api');
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock.mock.calls[0][0]).toBe('fsApi');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('homedir');

  expect(exposeInMainWorldMock.mock.calls[0][1].homedir).toBe(homedir());
});
