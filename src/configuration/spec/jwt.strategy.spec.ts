import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { UsuarioService } from '../../modules/usuario/service/usuario.service';
import { UnauthorizedException } from '@nestjs/common';

class MockUsuarioService {
  findUserByUsername = jest.fn();
}

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usuarioService: MockUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsuarioService,
          useClass: MockUsuarioService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    usuarioService = module.get<MockUsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user when a valid payload is provided', async () => {
      const mockUser = { id: 1, username: 'testUser' };
      usuarioService.findUserByUsername.mockResolvedValue(mockUser);

      const payload = {
        sub: 1,
        username: 'testUser',
        iat: 123456,
        exp: 789012,
      } as any;
      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(usuarioService.findUserByUsername).toHaveBeenCalledWith(
        'testUser',
      );
    });

    it('should throw UnauthorizedException when an invalid payload is provided', async () => {
      usuarioService.findUserByUsername.mockResolvedValue(null);

      const invalidPayload = {
        sub: 1,
        username: 'nonexistentUser',
        iat: 123456,
        exp: 789012,
      } as any;

      await expect(jwtStrategy.validate(invalidPayload)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(usuarioService.findUserByUsername).toHaveBeenCalledWith(
        'nonexistentUser',
      );
    });
  });
});
