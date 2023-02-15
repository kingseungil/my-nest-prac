import { AuthService } from './../auth/auth.service';
import { UsersService } from './users.service';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
    Logger,
    LoggerService,
    Inject,
    Body,
    Controller,
    Post,
    Query,
    Get,
    Headers,
    UseGuards,
    InternalServerErrorException,
} from '@nestjs/common';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Param } from '@nestjs/common/decorators';
import { UserInfo } from './dto/user-info.dto';
import { AuthGuard } from 'src/auth.guard';
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

    // private printLoggerServiceLog(dto) {
    //     try {
    //         throw new InternalServerErrorException('test');
    //     } catch (e) {
    //         this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    //     }
    //     this.logger.warn('warn: ' + JSON.stringify(dto));
    //     this.logger.log('log: ' + JSON.stringify(dto));
    //     this.logger.verbose('verbose: ' + JSON.stringify(dto));
    //     this.logger.debug('debug: ' + JSON.stringify(dto));
    // }

    /**
     * 회원가입
     * @param dto
     */
    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        // this.printLoggerServiceLog(dto);
        const { name, email, password } = dto;
        await this.usersService.createUser(name, email, password);
    }

    /**
     * 이메일 검증
     * @param dto
     * @returns
     */
    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signupVerifyToken } = dto;
        return await this.usersService.verifyEmail(signupVerifyToken);
    }

    /**
     * 로그인
     * @param dto
     * @returns
     */
    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;

        return await this.usersService.login(email, password);
    }

    /**
     * 유저정보 가져오기
     * @param userId
     * @returns
     */
    // @Get('/:id')
    // async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    //     const jwtString = headers.authorization.split(' ')[1];
    //     this.authService.verify(jwtString);
    //     return await this.usersService.getUserInfo(userId);
    // }
    @UseGuards(AuthGuard)
    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
        return await this.usersService.getUserInfo(userId);
    }
}
