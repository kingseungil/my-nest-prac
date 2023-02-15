import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from './config/authConfig';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UserEntity } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot({
            envFilePath: [`src/config/env/.${process.env.NODE_ENV}.env`],
            load: [emailConfig, authConfig],
            isGlobal: true,
            validationSchema,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: 3306,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: 'nest-test',
            // entities: [__dirname + '/**/*.entities{.ts,.js'], // FIXME: 웨 않되?
            entities: [UserEntity],
            synchronize: true,
            logging: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
