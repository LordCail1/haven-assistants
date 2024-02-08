import { BearerTokenGuard } from '../bearerToken.guard';
import { ConfigService } from '@nestjs/config';

describe('GuardsGuard', () => {
  it('should be defined', () => {
    expect(new BearerTokenGuard(new ConfigService())).toBeDefined();
  });
});
