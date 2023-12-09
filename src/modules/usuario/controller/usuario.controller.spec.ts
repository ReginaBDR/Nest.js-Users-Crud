import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';
import { JwtAuthGuard } from '../../../configuration/jwt-auth.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class MockRepository extends Repository<Usuario> {}
class MockJwtAuthGuard {
  canActivate = jest.fn(() => true);
}

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: MockRepository,
        },
        {
          provide: JwtAuthGuard,
          useClass: MockJwtAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUsuarioDto = {
        username: 'testUser',
        password: 'testPassword',
        email: 'testUser@example.com',
      };

      const createdUser: Usuario = {
        id: 1,
        ...createUserDto,
        profilePicture: 'url_to_picture',
        profileDescription: 'Some description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(usuarioService, 'createUser')
        .mockResolvedValueOnce(createdUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(createdUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const users: Usuario[] = [
        {
          id: 1,
          username: 'user1',
          password: 'hashedPassword1',
          email: 'user1@example.com',
          profilePicture: 'url_to_picture1',
          profileDescription: 'Description 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: 'user2',
          password: 'hashedPassword2',
          email: 'user2@example.com',
          profilePicture: 'url_to_picture2',
          profileDescription: 'Description 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(usuarioService, 'findAllUsers').mockResolvedValueOnce(users);

      const result = await controller.getAllUsers(10, 1);

      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user: Usuario = {
        id: 1,
        username: 'user1',
        password: 'hashedPassword1',
        email: 'user1@example.com',
        profilePicture: 'url_to_picture1',
        profileDescription: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usuarioService, 'findUserById').mockResolvedValueOnce(user);

      const result = await controller.getUserById('1');

      expect(result).toEqual(user);
    });

    it('should handle a non-existing user by returning null', async () => {
      jest.spyOn(usuarioService, 'findUserById').mockResolvedValueOnce(null);

      const result = await controller.getUserById('999');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const updateUserDto: Partial<Usuario> = {
        username: 'updatedUser',
      };

      const updatedUser: Usuario = {
        id: 1,
        username: 'updatedUser',
        password: 'hashedPassword1', // Ensure the password is hashed or mock it appropriately
        email: 'user1@example.com',
        profilePicture: 'url_to_picture1',
        profileDescription: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(usuarioService, 'updateUser')
        .mockResolvedValueOnce(updatedUser);

      const result = await controller.updateUser('1', updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should handle updating a non-existing user by returning null', async () => {
      const updateUserDto: Partial<Usuario> = {
        username: 'updatedUser',
      };

      jest.spyOn(usuarioService, 'updateUser').mockResolvedValueOnce(null);

      const result = await controller.updateUser('999', updateUserDto);

      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const createUserDto: CreateUsuarioDto = {
        username: 'testUser',
        password: 'testPassword',
        email: 'testUser@example.com',
      };

      const createdUser: Usuario = {
        id: 1,
        ...createUserDto,
        profilePicture: 'url_to_picture',
        profileDescription: 'Some description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(usuarioService, 'createUser')
        .mockResolvedValueOnce(createdUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(createdUser);

      jest.spyOn(usuarioService, 'deleteUser').mockResolvedValueOnce();

      const response = await controller.deleteUser('1');

      expect(response).toBeUndefined();
    });

    it('should handle deleting a non-existing user by returning null', async () => {
      jest.spyOn(usuarioService, 'deleteUser').mockResolvedValueOnce(null);

      const result = await controller.deleteUser('999');

      expect(result).toBeNull();
    });
  });
});
