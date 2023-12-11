import { Module } from '@nestjs/common';
import { HelpersService } from './services/helpers.service';

/**
 * This module is a helper module. It groups together some helper functions
 * that do not have any particular domain.
 */
@Module({
  providers: [HelpersService],
  exports: [HelpersService],
})
export class HelpersModule {}
