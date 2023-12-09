import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { LocalAuthGuard } from '../../../configuration/local-auth.guard';
import { UsuarioService } from '../../usuario/service/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

class MockRepository extends Repository<Usuario> {}
class MockLocalAuthGuard {
  canActivate = jest.fn(() => true);
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsuarioService,
        JwtService,
        {
          provide: LocalAuthGuard,
          useClass: MockLocalAuthGuard,
        },
        {
          provide: getRepositoryToken(Usuario),
          useClass: MockRepository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { username: 'testUser', password: 'testPassword' };
      jest.spyOn(authService, 'login').mockResolvedValue('fakeAccessToken');

      const result = await controller.login({ user });

      expect(result).toEqual('fakeAccessToken');
    });
  });
});
