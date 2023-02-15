import { AuthService } from './../auth/auth.service';
import { UserInfo } from './dto/user-info.dto';
import { EmailService } from './../email/email.service';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>, // 유저 저장소 주입
        private readonly emailService: EmailService,
        private readonly dataSource: DataSource,
        private readonly authService: AuthService,
    ) {}

    async createUser(name: string, email: string, password: string) {
        const signupVerifyToken = uuid.v1();

        // FIXME: await Promise.all 로 바꾸기?
        const userExist = await this.checkUserExists(email);
        if (userExist) {
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없어용');
        }
        await this.saveUser(name, email, password, signupVerifyToken);
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }

    private async checkUserExists(email: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            where: { email: email },
        });
        if (user) {
            return true;
        } else {
            return false;
        }
    }
    private async saveUser(
        name: string,
        email: string,
        password: string,
        signupVerifyToken: string,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = new UserEntity();
            user.id = ulid(); // 랜덤한 스트링 값 생성(ulid)
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await queryRunner.manager.save(user);

            // throw new InternalServerErrorException('강제 에러발생!');

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
    private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {
        const user = await this.usersRepository.findOne({
            where: { signupVerifyToken },
        });
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }
    async login(email: string, password: string): Promise<string> {
        const user = await this.usersRepository.findOne({
            where: { email, password },
        });
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않아용');
        }

        return { id: user.id, name: user.name, email: user.email };
    }
}
