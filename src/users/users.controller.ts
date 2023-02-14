import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Param } from '@nestjs/common/decorators';
import { UserInfo } from './dto/user-info.dto';

@Controller('users')
export class UsersController {
    /**
     * 회원가입
     * @param dto
     */
    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        console.log(dto);
    }

    /**
     * 이메일 검증
     * @param dto
     * @returns
     */
    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        console.log(dto);
        return;
    }

    /**
     * 로그인
     * @param dto
     * @returns
     */
    @Post()
    async login(@Body() dto: UserLoginDto): Promise<string> {
        console.log(dto);
        return;
    }

    /**
     * 유저정보 가져오기
     * @param userId
     * @returns
     */
    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
        console.log(userId);
        return;
    }
}
