
import {
    Controller,
    Inject,
    Post,
    Get,
    HttpStatus,
    Req,
    UseGuards,
    HttpCode,
    Body
} from '@nestjs/common';
import { AuthService } from './auth.service';

import type { Request } from 'express';
import { JwtGuard, LocalGuard } from './guards/inbox';
import type { CreateUserDto } from 'src/database/dto';




@Controller('auth')
export class AuthController {
    constructor (
        @Inject(AuthService) private readonly authService: AuthService
    ) { }

    @Post('login')
    @UseGuards(LocalGuard)
    @HttpCode(HttpStatus.FOUND)
    async login(@Req() reqBody: Request) {
        return {
            token: reqBody.user,
            message: "login successful",
            error: false,

        }
    }

    @Get('')
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.FOUND)
    async getUserStatus(@Req() reqBody: Request) {
        return {
            data: reqBody.user,
            message: "User find successful",
            status: HttpStatus.FOUND,
            error: false
        }
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.authService.registerUser(body);
        
        return {
            message: "User create successfuly",
            status: HttpStatus.CREATED,
            error: false
        }
    }
    @Post('create/admin')
    @HttpCode(HttpStatus.CREATED)
    async createAdmin(@Body() body: CreateUserDto) {
        const user = await this.authService.registerAdmin(body);
        
        return {
            message: "User create successfuly",
            status: HttpStatus.CREATED,
            error: false
        }
    }


}
