// FoalTS
import { FileSystemService, Generator, LoggerService } from '../../../services';
import { CreateAppCommandService } from './create-app-command.service';

describe('CreateAppCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: CreateAppCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
    service = new CreateAppCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  it('should abort the project creation if a directory already exists.', async () => {
    generator.ensureDir('test-foo-bar');

    await service.run({ name: 'test-fooBar' });

    generator.assertEmptyDir('test-foo-bar');
  });

  it('should render the config templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/config')
      .assertEqual('default.json', 'app/config/default.json')
      .assertNotExists('default.yml')
      .assertEqual('development.json', 'app/config/development.json')
      .assertNotExists('development.yml')
      .assertEqual('e2e.json', 'app/config/e2e.json')
      .assertNotExists('e2e.yml')
      .assertEqual('production.json', 'app/config/production.json')
      .assertNotExists('production.yml')
      .assertEqual('test.json', 'app/config/test.json')
      .assertNotExists('test.yml');
  });

  it('should render the config templates (YAML option).', async () => {
    await service.run({ name: 'test-fooBar', yaml: true });

    generator
      .cd('test-foo-bar/config')
      .assertNotExists('default.json')
      .assertEqual('default.yml', 'app/config/default.yml')
      .assertNotExists('development.json')
      .assertEqual('development.yml', 'app/config/development.yml')
      .assertNotExists('e2e.json')
      .assertEqual('e2e.yml', 'app/config/e2e.yml')
      .assertNotExists('production.json')
      .assertEqual('production.yml', 'app/config/production.yml')
      .assertNotExists('test.json')
      .assertEqual('test.yml', 'app/config/test.yml');
  });

  it('should render the config templates (MongoDB option).', async () => {
    await service.run({ name: 'test-fooBar', mongodb: true });

    generator
      .cd('test-foo-bar/config')
      .assertEqual('default.json', 'app/config/default.mongodb.json')
      .assertNotExists('default.yml')
      .assertEqual('development.json', 'app/config/development.json')
      .assertNotExists('development.yml')
      .assertEqual('e2e.json', 'app/config/e2e.mongodb.json')
      .assertNotExists('e2e.yml')
      .assertEqual('production.json', 'app/config/production.json')
      .assertNotExists('production.yml')
      .assertEqual('test.json', 'app/config/test.mongodb.json')
      .assertNotExists('test.yml');
  });

  it('should render the config templates (MongoDB & YAML options).', async () => {
    await service.run({ name: 'test-fooBar', mongodb: true, yaml: true });

    generator
      .cd('test-foo-bar/config')
      .assertNotExists('default.json')
      .assertEqual('default.yml', 'app/config/default.mongodb.yml')
      .assertNotExists('development.json')
      .assertEqual('development.yml', 'app/config/development.yml')
      .assertNotExists('e2e.json')
      .assertEqual('e2e.yml', 'app/config/e2e.mongodb.yml')
      .assertNotExists('production.json')
      .assertEqual('production.yml', 'app/config/production.yml')
      .assertNotExists('test.json')
      .assertEqual('test.yml', 'app/config/test.mongodb.yml');
  });

  it('should copy the public directory.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/public')
      .assertEqual('index.html', 'app/public/index.html')
      .assertEqual('logo.png', 'app/public/logo.png');
  });

  it('shoud copy the src/e2e templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src/e2e')
      .assertEqual('index.ts', 'app/src/e2e/index.ts');
  });

  it('shoud copy the src/scripts templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src/scripts')
      .assertEqual('create-user.ts', 'app/src/scripts/create-user.ts');
  });

  it('should render the src/app/controllers templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src/app/controllers')
      .assertEqual('index.ts', 'app/src/app/controllers/index.ts')
      .assertEqual('api.controller.spec.ts', 'app/src/app/controllers/api.controller.spec.ts')
      .assertEqual('api.controller.ts', 'app/src/app/controllers/api.controller.ts');
  });

  it('should render the src/app/hooks templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src/app/hooks')
      .assertEqual('index.ts', 'app/src/app/hooks/index.ts');
  });

  it('should render the src/app/entities templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src/app/entities')
      .assertEqual('index.ts', 'app/src/app/entities/index.ts')
      .assertEqual('user.entity.ts', 'app/src/app/entities/user.entity.ts')
      .cd('..');
  });

  it('should render the src/app/entities templates (MongoDB).', async () => {
    await service.run({ name: 'test-fooBar', mongodb: true });

    generator
      .cd('test-foo-bar/src/app/entities')
      .assertEqual('index.ts', 'app/src/app/entities/index.ts')
      .assertEqual('user.entity.ts', 'app/src/app/entities/user.entity.mongodb.ts')
      .cd('..');
  });

  it('should render the src/app/services templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src/app/services')
      .assertEqual('index.ts', 'app/src/app/services/index.ts');
 });

  it('should render the src/app templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src/app')
      .assertEqual('app.controller.ts', 'app/src/app/app.controller.ts');
  });

  it('should render the src templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar/src')
      .assertEqual('db.ts', 'app/src/db.ts')
      .assertEqual('e2e.ts', 'app/src/e2e.ts')
      .assertEqual('index.ts', 'app/src/index.ts')
      .assertEqual('test.ts', 'app/src/test.ts');
  });

  it('should render the root templates.', async () => {
    await service.run({ name: 'test-fooBar' });

    generator
      .cd('test-foo-bar')
      .assertEqual('.gitignore', 'app/gitignore')
      .assertEqual('package.json', 'app/package.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.app.json', 'app/tsconfig.app.json')
      .assertEqual('tsconfig.e2e.json', 'app/tsconfig.e2e.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.test.json', 'app/tsconfig.test.json')
      .assertEqual('.eslintrc.js', 'app/.eslintrc.js');
  });
  it('should render the root templates (YAML option).', async () => {
    await service.run({ name: 'test-fooBar', yaml: true });

    generator
      .cd('test-foo-bar')
      .assertEqual('.gitignore', 'app/gitignore')
      .assertEqual('package.json', 'app/package.yaml.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.app.json', 'app/tsconfig.app.json')
      .assertEqual('tsconfig.e2e.json', 'app/tsconfig.e2e.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.test.json', 'app/tsconfig.test.json')
      .assertEqual('.eslintrc.js', 'app/.eslintrc.js');
  });

  it('should render the root templates (MongoDB option).', async () => {
    await service.run({ name: 'test-fooBar', mongodb: true });

    generator
      .cd('test-foo-bar')
      .assertEqual('.gitignore', 'app/gitignore')
      .assertEqual('package.json', 'app/package.mongodb.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.app.json', 'app/tsconfig.app.json')
      .assertEqual('tsconfig.e2e.json', 'app/tsconfig.e2e.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.test.json', 'app/tsconfig.test.json')
      .assertEqual('.eslintrc.js', 'app/.eslintrc.js');
  });

  it('should render the root templates (MongoDB & YAML options).', async () => {
    await service.run({ name: 'test-fooBar', mongodb: true, yaml: true });

    generator
      .cd('test-foo-bar')
      .assertEqual('.gitignore', 'app/gitignore')
      .assertEqual('package.json', 'app/package.mongodb.yaml.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.app.json', 'app/tsconfig.app.json')
      .assertEqual('tsconfig.e2e.json', 'app/tsconfig.e2e.json')
      .assertEqual('tsconfig.json', 'app/tsconfig.json')
      .assertEqual('tsconfig.test.json', 'app/tsconfig.test.json')
      .assertEqual('.eslintrc.js', 'app/.eslintrc.js');
  });

});

