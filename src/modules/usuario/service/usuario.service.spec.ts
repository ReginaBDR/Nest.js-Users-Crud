import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';
import * as bcrypt from 'bcrypt';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(Repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUsuarioDto = {
        username: 'testUser',
        password: 'testPassword',
        email: 'testUser@example.com',
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const createdUser: Usuario = {
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        profilePicture: 'url_to_picture',
        profileDescription: 'Some description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(createdUser);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(createdUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(createdUser);
    });
  });

  describe('createUsers', () => {
    it('should create multiple users', async () => {
      const createUsersDto: CreateUsuarioDto[] = [
        {
          username: 'user1',
          password: 'password1',
          email: 'user1@example.com',
        },
        {
          username: 'user2',
          password: 'password2',
          email: 'user2@example.com',
        },
      ];

      const hashedPasswords = await Promise.all(
        createUsersDto.map((dto) => bcrypt.hash(dto.password, 10)),
      );

      const createdUsers: Usuario[] = createUsersDto.map((dto, index) => ({
        id: index + 1,
        ...dto,
        password: hashedPasswords[index],
        profilePicture: 'url_to_picture',
        profileDescription: 'Some description',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      jest.spyOn(repository, 'create').mockReturnValueOnce(createdUsers[0]);
      jest.spyOn(repository, 'create').mockReturnValueOnce(createdUsers[1]);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(createdUsers as any);

      const result = await service.createUsers(createUsersDto);

      expect(result).toEqual(createdUsers);
    });
  });

  describe('findAllUsers', () => {
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

      jest.spyOn(repository, 'find').mockResolvedValueOnce(users);

      const result = await service.findAllUsers(10, 1);

      expect(result).toEqual(users);
    });
  });

  describe('findUserById', () => {
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

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findUserById(1);

      expect(result).toEqual(user);
    });

    it('should return undefined for a non-existing user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      const result = await service.findUserById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('findUserByUsername', () => {
    it('should return a user by username', async () => {
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

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findUserByUsername('user1');

      expect(result).toEqual(user);
    });

    it('should return undefined for a non-existing username', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      const result = await service.findUserByUsername('nonexistentUser');

      expect(result).toBeUndefined();
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
        password: bcrypt.hash('hashedPassword1', 10),
        email: 'user1@example.com',
        profilePicture: 'url_to_picture1',
        profileDescription: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findUserById').mockResolvedValueOnce(updatedUser);

      const result = await service.updateUser(1, updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should return undefined for updating a non-existing user', async () => {
      const updateUserDto: Partial<Usuario> = {
        username: 'updatedUser',
      };

      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findUserById').mockResolvedValueOnce(undefined);

      const result = await service.updateUser(999, updateUserDto);

      expect(result).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await expect(service.deleteUser(1)).resolves.toBeUndefined();
    });

    it('should handle deleting a non-existing user and throw an exception', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValueOnce(new Error('Entity not found'));

      await expect(service.deleteUser(999)).rejects.toThrow('Entity not found');
    });
  });
});
