import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
