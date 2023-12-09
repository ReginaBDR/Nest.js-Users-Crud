import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { UsuarioService } from '../../usuario/service/usuario.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

class MockRepository extends Repository<Usuario> {}

describe('AuthService', () => {
  let authService: AuthService;
  let usuarioService: UsuarioService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: MockRepository,
        },
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if username and password are valid', async () => {
      const mockUser: Usuario = {
        id: 1,
        username: 'testUser',
        password: 'hashedPassword',
        email: 'testUser@example.com',
        profilePicture: 'url_to_picture',
        profileDescription: 'Some description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(usuarioService, 'findUserByUsername')
        .mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('testUser', 'password');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotAcceptableException if user is not found', async () => {
      jest.spyOn(usuarioService, 'findUserByUsername').mockResolvedValue(null);

      await expect(
        authService.validateUser('nonexistentUser', 'password'),
      ).rejects.toThrow(NotAcceptableException);
    });

    it('should throw NotAcceptableException if password is invalid', async () => {
      const mockUser: Usuario = {
        id: 1,
        username: 'testUser',
        password: 'hashedPassword',
        email: 'testUser@example.com',
        profilePicture: 'url_to_picture',
        profileDescription: 'Some description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(usuarioService, 'findUserByUsername')
        .mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        authService.validateUser('testUser', 'invalidPassword'),
      ).rejects.toThrow(NotAcceptableException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = {
        id: 1,
        username: 'testUser',
        password: 'hashedPassword',
      };
      jest.spyOn(jwtService, 'sign').mockReturnValue('fakeAccessToken');

      const result = await authService.login(mockUser);

      expect(result).toEqual({ access_token: 'fakeAccessToken' });
    });
  });
});
