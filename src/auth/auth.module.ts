import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies/inbox';
import { RolesGuard } from './guards/roles.guard';
import { Reflector } from '@nestjs/core';


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: "abc123",
            signOptions: {
                expiresIn: "1h"
            }
        }
        )
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        RolesGuard,
        Reflector
      

    ],

    exports: [
        RolesGuard
    ]
})
export class AuthModule { }
