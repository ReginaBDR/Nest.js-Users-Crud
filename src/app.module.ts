import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersSeeder } from './seeder/users-seeder.config';
import { Usuario } from './modules/usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'postgres',
      entities: [Usuario],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersSeeder],
})
export class AppModule {}
