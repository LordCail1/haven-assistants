import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { bearer_token } from 'src/shared/constants';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    const clientToken = authHeader && authHeader.split(' ')[1];

    const secretToken = this.configService.get<string>(bearer_token);

    if (clientToken !== secretToken) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
