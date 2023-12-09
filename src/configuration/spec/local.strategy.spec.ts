import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from '../local.strategy';
import { AuthService } from '../../modules/auth/service/auth.service';
import { UnauthorizedException } from '@nestjs/common';

class MockAuthService {
  validateUser = jest.fn();
}

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<MockAuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user when valid credentials are provided', async () => {
      const mockUser = {
        id: 1,
        username: 'testUser',
        password: 'hashedPassword',
      };
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('testUser', 'password123');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'testUser',
        'password123',
      );
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        localStrategy.validate('invalidUser', 'invalidPassword'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'invalidUser',
        'invalidPassword',
      );
    });
  });
});
