import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from 'src/configuration/local-auth.guard';
import { AuthService } from '../service/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: LocalAuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
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
