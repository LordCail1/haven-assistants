import { ConfigService } from '@nestjs/config';
import { BearerTokenGuard } from '../bearerToken.guard';

describe('GuardsGuard', () => {
  it('should be defined', () => {
    expect(new BearerTokenGuard(new ConfigService())).toBeDefined();
  });
});
