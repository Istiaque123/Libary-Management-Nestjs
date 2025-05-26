import { UserService } from './user.service';
import { UserController } from './user.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';

import { AuthModule } from 'src/auth';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule

    ],
    controllers: [
        UserController,],
    providers: [
        UserService,

    ],
})
export class UserModule { }
