import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { LocalAuthGuard } from 'src/configuration/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    this.logger.log('Login');
    return this.authService.login(req.user);
  }
}
