import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../modules/usuario/service/usuario.service';
import { UsersSeeder } from './users-seeder.config';

jest.mock('bcrypt', () => ({
  hash: jest.fn((password: string = 'hashedPassword') =>
    Promise.resolve(password),
  ),
}));

describe('UsersSeeder', () => {
  let usersSeeder: UsersSeeder;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersSeeder,
        {
          provide: UsuarioService,
          useFactory: () => ({
            findAllUsers: jest.fn(),
            createUsers: jest.fn(),
          }),
        },
      ],
    }).compile();

    usersSeeder = module.get<UsersSeeder>(UsersSeeder);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('should create mock users if no users exist', async () => {
    (usuarioService.findAllUsers as jest.Mock).mockResolvedValue([]);
    (usuarioService.createUsers as jest.Mock).mockResolvedValueOnce([]);
    await usersSeeder.onModuleInit();
    expect(usuarioService.findAllUsers).toHaveBeenCalledWith(1, 1);
    expect(usuarioService.createUsers).toHaveBeenCalled();
  });

  it('should not create mock users if users already exist', async () => {
    (usuarioService.findAllUsers as jest.Mock).mockResolvedValue([
      { id: 1, username: 'user1', password: 'hashedPassword' },
    ]);
    (usuarioService.createUsers as jest.Mock).mockResolvedValueOnce([]);
    await usersSeeder.onModuleInit();
    expect(usuarioService.findAllUsers).toHaveBeenCalledWith(1, 1);
    expect(usuarioService.createUsers).not.toHaveBeenCalled();
  });

  it('should log an error if an exception occurs during mock user creation', async () => {
    (usuarioService.findAllUsers as jest.Mock).mockRejectedValue(
      new Error('Error during mock user creation'),
    );
    const errorSpy = jest.spyOn(usersSeeder['logger'], 'error');
    await usersSeeder.onModuleInit();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error during mock user creation'),
    );
  });
});
