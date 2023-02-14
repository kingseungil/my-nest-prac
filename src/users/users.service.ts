import { UserInfo } from './dto/user-info.dto';
import { EmailService } from './../email/email.service';
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
    constructor(private readonly emailService: EmailService) {}
    private checkUserExists(email: string) {
        return false; // TODO: DB 연동 후 구현
    }
    private saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
        return; // TODO: DB 연동 후 구현
    }
    private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }
    async createUser(name: string, email: string, password: string) {
        const signupVerifyToken = uuid.v1();

        // FIXME: await Promise.all 로 바꾸기?
        await this.checkUserExists(email);
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
