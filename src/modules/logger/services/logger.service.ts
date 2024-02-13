import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LOGGER_LEVELS } from 'src/shared/enums/enums';

@Injectable()
export class MyLogger implements LoggerService {
  private loggerLevel: string[];
  constructor(private configService: ConfigService) {
    this.loggerLevel = this.configService.get<string>('LOG_LEVELS').split(',');
  }

  test(message: any, ...params: any[]) {
    if (this.includesLogger(LOGGER_LEVELS.TEST)) {
      console.log(message, ...params);
    }
  }

  log(message: any, ...params: any[]) {
    if (this.includesLogger(LOGGER_LEVELS.LOG)) {
      console.log(message, ...params);
    }
  }
  error(message: any, ...params: any[]) {
    if (this.includesLogger(LOGGER_LEVELS.ERROR)) {
      console.error(message, ...params);
    }
  }
  warn(message: any, ...params: any[]) {
    if (this.includesLogger(LOGGER_LEVELS.WARN)) {
      console.warn(message, ...params);
    }
  }
  debug(message: any, ...params: any[]) {
    if (this.includesLogger(LOGGER_LEVELS.DEBUG)) {
      console.log(message, ...params);
    }
  }

  private includesLogger(level: LOGGER_LEVELS) {
    return this.loggerLevel.includes(level);
  }
}
