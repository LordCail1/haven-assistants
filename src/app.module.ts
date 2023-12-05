import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from './modules/openai/openai.module';
import { SignupStepsModule } from './modules/signup-steps/signup-steps.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    OpenaiModule,
    UsersModule,
    SignupStepsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
