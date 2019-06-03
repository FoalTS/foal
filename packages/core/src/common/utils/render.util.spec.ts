// std
import { notStrictEqual, ok, strictEqual } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

// FoalTS
import { HttpResponseOK } from '../../core';
import { render } from './render.util';

const template = 'Hello <%= name %>! How are you?';

describe('render', () => {
  const templatesPath = join(__dirname, './templates');
  const templatePath = join(__dirname, './templates/template.html');

  before(() => {
    if (!existsSync(templatesPath)) {
      mkdirSync(templatesPath);
    }
    writeFileSync(templatePath, template, 'utf8');
  });

  after(() => {
    if (existsSync(templatePath)) {
      unlinkSync(templatePath);
    }
    if (existsSync(templatesPath)) {
      rmdirSync(templatesPath);
    }
  });

  it('should render the ejs template (HttpResponseOK) with the given locals if it is correct.', async () => {
    const name = 'Foobar';
    const expected = `Hello ${name}! How are you?`;
    const actual = await render('./templates/template.html', { name }, __dirname);
    ok(actual instanceof HttpResponseOK);
    strictEqual(actual.body, expected);
  });

  it('should throw an Error if the template and/or locals are incorrect.', async () => {
    try {
      await render(templatePath, {}, __dirname);
      throw new Error('An error should have been thrown');
    } catch (error) {
      notStrictEqual(error.message, 'An error should have been thrown');
    }
  });

});
