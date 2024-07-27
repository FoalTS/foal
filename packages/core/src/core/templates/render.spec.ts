// std
import { ok, strictEqual } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

// FoalTS
import { HttpResponseOK } from '../http';
import { Config } from '../config';
import { render, renderToString } from './render';

const ejsTemplate = 'Hello <%= name %>! How are you?';
const twigTemplate = '{% for user in users %} {{ user.name }} {% endfor %}';
const defaultTemplate = 'Hello {{ name }}! How are you?';

describe('renderToString', () => {

  it('should render the template with the given locals.', () => {
    const template = 'Hello {{ name }} {{ lastName }}!';
    const locals = { name: 'Mary', lastName: 'Johnson' };

    const expected = 'Hello Mary Johnson!';
    const actual = renderToString(template, locals);
    strictEqual(actual, expected);
  });

  it('should use the locals as many times as needed.', () => {
    const template = 'Hello {{ name }} {{ name }}!';
    const locals = { name: 'Mary' };

    const expected = 'Hello Mary Mary!';
    const actual = renderToString(template, locals);
    strictEqual(actual, expected);
  });

});

describe('render', () => {
  const templatesPath = join(__dirname, './templates');
  const ejsTemplatePath = join(__dirname, './templates/template.ejs.html');
  const twigTemplatePath = join(__dirname, './templates/template.twig.html');
  const defaultTemplatePath = join(__dirname, './templates/template.default.html');
  const rootTemplatePath = './template.default.html';

  before(() => {
    if (!existsSync(templatesPath)) {
      mkdirSync(templatesPath);
    }
    writeFileSync(ejsTemplatePath, ejsTemplate, 'utf8');
    writeFileSync(twigTemplatePath, twigTemplate, 'utf8');
    writeFileSync(defaultTemplatePath, defaultTemplate, 'utf8');
    writeFileSync(rootTemplatePath, defaultTemplate, 'utf8');
  });

  after(() => {
    if (existsSync(ejsTemplatePath)) {
      unlinkSync(ejsTemplatePath);
    }
    if (existsSync(twigTemplatePath)) {
      unlinkSync(twigTemplatePath);
    }
    if (existsSync(defaultTemplatePath)) {
      unlinkSync(defaultTemplatePath);
    }
    if (existsSync(rootTemplatePath)) {
      unlinkSync(rootTemplatePath);
    }
    if (existsSync(templatesPath)) {
      rmdirSync(templatesPath);
    }
  });

  it('should throw an error if the template file does not exist.', async () => {
    try {
      await render('foobar.html', {}, __dirname);
      throw new Error('An error should have been thrown');
    } catch (error: any) {
      strictEqual(
        error.message.startsWith('ENOENT: no such file or directory, open'),
        true
      );
    }
  });

  describe('given the configuration key "settings.templateEngine" is undefined', () => {

    it('should render the template with the default built-in template engine.', async () => {
      const name = 'Foobar';
      const expected = `Hello ${name}! How are you?`;
      const actual = await render('./templates/template.default.html', { name }, __dirname);
      ok(actual instanceof HttpResponseOK);
      strictEqual(actual.body, expected);
    });

  });

  describe('given the configuration key "settings.templateEngine" is defined', () => {

    afterEach(() => Config.remove('settings.templateEngine'));

    it('should throw an Error if the given template engine is not compatible with Foal.', async () => {
      Config.set('settings.templateEngine', 'rimraf'); // A random package

      try {
        await render('./templates/template.default.html', {}, __dirname);
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        strictEqual(
          error.message,
          'rimraf is not a template engine compatible with FoalTS.'
        );
      }
    });

    it('should render the template with the given template engine (Express).', async () => {
      Config.set('settings.templateEngine', 'ejs');

      const name = 'Foobar';
      const expected = `Hello ${name}! How are you?`;
      const actual = await render('./templates/template.ejs.html', { name }, __dirname);
      ok(actual instanceof HttpResponseOK);
      strictEqual(actual.body, expected);
    });

    it('should render the template with the given template engine (Express: twig).', async () => {
      Config.set('settings.templateEngine', 'twig');

      const users = [ { name: 'John' }, { name: 'Mary'} ];
      const expected = ' John  Mary ';
      const actual = await render('./templates/template.twig.html', { users }, __dirname);
      ok(actual instanceof HttpResponseOK);
      strictEqual(actual.body, expected);
    });

    it('should throw errors returned by the given template engine (Express).', async () => {
      Config.set('settings.templateEngine', 'ejs');

      try {
        await render('./templates/template.ejs.html', {}, __dirname);
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        strictEqual(error.message.includes('name is not defined'), true);
      }
    });

  });

  it('should use the project directory as root directory if "dirname" is not defined', async () => {
    const name = 'Foobar';
    const expected = `Hello ${name}! How are you?`;
    const actual = await render(rootTemplatePath, { name });
    ok(actual instanceof HttpResponseOK);
    strictEqual(actual.body, expected);
  });

});
