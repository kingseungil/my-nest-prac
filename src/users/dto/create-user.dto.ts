import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @Transform(({ value, obj }) => {
        if (obj.password.includes(obj.name.trim())) {
            throw new BadRequestException('password와 name은 같은 문자열을 포함할 수 없습니다.');
        }
        return value.trim();
    })
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    readonly name: string;

    @IsString()
    @IsEmail()
    @MaxLength(60)
    readonly email: string;

    @IsString()
    @Matches(/^[a-zA-Z\d!@#$%^&*()]{8,30}$/) // 영문대,소문자 ,숫자,특수문자
    readonly password: string;
}
