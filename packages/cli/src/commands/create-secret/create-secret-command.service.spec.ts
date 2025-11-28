// std
import { strictEqual } from 'assert';
import { mock } from 'node:test';

// FoalTS
import { CryptoService, LoggerService } from '../../services';
import { CreateSecretCommandService } from './create-secret-command.service';

describe('CreateSecretCommandService', () => {
  let cryptoService: CryptoService;
  let loggerService: LoggerService;
  let service: CreateSecretCommandService;

  beforeEach(() => {
    cryptoService = new CryptoService();
    loggerService = new LoggerService();
    service = new CreateSecretCommandService(cryptoService, loggerService);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('has a "run" method that', () => {
    it('should create and log a new secret.', async () => {
      const secret = 'mock-secret-123';

      const createSecretMock = mock.method(cryptoService, 'createSecret', async () => secret).mock;
      const loggerInfoMock = mock.method(loggerService, 'info', () => {}).mock;

      await service.run();

      strictEqual(createSecretMock.callCount(), 1);
      strictEqual(loggerInfoMock.callCount(), 1);
      strictEqual(loggerInfoMock.calls[0].arguments[0], `New secret: ${secret}`);
    });
  });
});

