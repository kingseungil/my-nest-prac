import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './../email/email.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule, AuthModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
