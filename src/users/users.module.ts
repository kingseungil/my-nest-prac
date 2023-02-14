import { EmailModule } from './../email/email.module';
import { EmailService } from './../email/email.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
