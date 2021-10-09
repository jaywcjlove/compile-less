import fs from 'fs-extra';
import compile, { log } from '../src/compile';

it('compile test case', async () => {
  await compile('test/src', {
    out: 'test/out',
    combine: 'test/out/dist.css',
  });
  const dist = await fs.readFile('test/out/dist.css');
  expect(dist.indexOf(':global .a div') > -1).toBeTruthy();
  expect(fs.existsSync('test/out/dist.css')).toBeTruthy();
});

it('compile = rmGlobal test case', async () => {
  await compile('test/src', {
    out: 'test/out',
    combine: 'test/out/dist.css',
    rmGlobal: true,
  });
  const dist = await fs.readFile('test/out/dist.css');
  expect(dist.indexOf(':global .a div') === -1).toBeTruthy();
});

it('Folder undefined test case', async () => {
  console.log = jest.fn();
  await compile('test/srcs', {
    out: 'test/out',
    combine: 'test/out/dist2.css',
  });
  expect(fs.existsSync('test/out/dist2.css')).toBeFalsy();
  // @ts-ignore
  expect(console.log.mock.calls[0][0]).toBe(`🚧 \x1b[35mcompile-less-cli\x1b[0m =>\x1b[33m No content is output.\x1b[0m`);
});

it('log test case', async () => {
  console.log = jest.fn();
  expect(await log('output-path', 'test')).toBeUndefined()
  // @ts-ignore
  expect(console.log.mock.calls[0][0]).toBe(`♻️ \x1b[32m compile-less-cli\x1b[0m: test ┈> output-path`);
});

