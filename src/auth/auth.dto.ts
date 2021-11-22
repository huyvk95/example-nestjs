import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignInDto {
  @IsEmail()
  @ApiProperty({ default: 'huyvk95@gmail.com', required: true })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Huy!12345', required: true })
  password: string;
}

export class UserSignUpDto {
  @MaxLength(32)
  @MinLength(8)
  @IsEmail()
  @ApiProperty({ default: 'huyvk95@gmail.com', required: true })
  email: string;

  @MaxLength(32)
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({ default: 'Huy!12345', required: true })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Huy Van', required: true })
  name?: string;
}
