import { UserInfo } from './dto/user-info.dto';
import { EmailService } from './../email/email.service';
import {
    Injectable,
    InternalServerErrorException,
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
    ) {}

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

    async verifyEmail(signupVerifyToken): Promise<string> {
        // TODO: DB, JWT 연동 후 구현
        // 1. DB에서 인증토큰으로 회원 가입 처리중인 유저있는지 조회하고 없다면 에러처리
        // 2. 바로 로그인 상태가 되도록 JWT발급

        throw new Error('Method not implemented');
    }
    async login(email, password): Promise<string> {
        // TODO: DB, JWT 연동 후 구현
        // 1. email, password 를 가진 유저가 존재하는지 DB에서 확인 후 없다면 에러처리
        // 2. JWT발급

        throw new Error('Method not  implemented');
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        // TODO: DB,JWT 연동 후 구현
        // 1. userId를 가진 유저가 존재하는지 DB에서 확인 후 없다면 에러처리
        // 2. 조회된 데이터를 UserInfo타입으로 응답(리턴)

        throw new Error('Method not  implemented');
    }
}
