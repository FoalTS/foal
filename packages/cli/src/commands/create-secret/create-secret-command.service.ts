import { CryptoService, LoggerService } from '../../services';

export class CreateSecretCommandService {
  constructor(
    private cryptoService: CryptoService,
    private loggerService: LoggerService,
  ) {}

  async run(): Promise<void> {
    const secret = await this.cryptoService.createSecret();
    this.loggerService.info(`New secret: ${secret}`);
  }
}

