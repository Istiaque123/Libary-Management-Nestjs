
import {
    Controller,
    Inject,
    UseGuards,
    Get,
    Post,
    HttpCode,
    HttpStatus,
    Req,
    Body,
    Param,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UploadedFile,
    HttpException,
    BadRequestException,
    ParseIntPipe
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { type UpdateUserDto } from 'src/database/dto';
import { UserService } from './user.service';
import type { User } from 'src/database/entities';
import { UserRole, type RequestWithUser } from 'src/common/types';
import { APIResponse } from 'src/common/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
import { multerConfig } from 'src/common/config';
import { writeFile } from 'fs/promises';
import { writeFileSync } from 'fs';
import { use } from 'passport';
import type { UserProfileDto } from './dto';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {
    constructor (@Inject(UserService) private readonly userService: UserService) { }


    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.FOUND)
    async getInfo(@Req() reqBody: RequestWithUser) {
        return {
            data: reqBody.user,
            message: "User Found",
            error: false,
            status: HttpStatus.FOUND
        }
    }

    @Post('update-user')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.ACCEPTED)
    async updateUserInfo(@Req() req: RequestWithUser, @Body() body: UpdateUserDto) {

        await this.userService.updateUser(req.user.id, body);
        return APIResponse.update(null, "User update successfully")

    }

    @Get('delete')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Req() req: RequestWithUser) {
        await this.userService.deleteById(req.user.id);
        return APIResponse.delte({
            username: req.user.username,
            email: req.user.email
        })

    }

    // Admin only
    @Get('/all')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.FOUND)
    async getAllUser(): Promise<APIResponse<User[]>> {
        const users: User[] = await this.userService.findAll();
        return APIResponse.found(users, "All user fetched")

    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.FOUND)
    async getUserById(@Param('id',) id: number) {
        const user: User = await this.userService.findOneById(+id);

        return APIResponse.found(user, "User found successfully");
    }

    @Post('update/:id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async updateById(@Param('id',) id: number, @Body() body: UpdateUserDto) {
        const user = await this.userService.updateUser(+id, body);

        return APIResponse.update(user, "Info update successful");
    }

    @Post('upload-profile-picture/:id')
    @UseInterceptors(FileInterceptor('profilePicture'))
    @HttpCode(HttpStatus.ACCEPTED)
    async uploadProfilePicture(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    // new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png)$/ }),
                ],
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
            }),)
        file: Express.Multer.File): Promise<APIResponse<{
            updateUser: UserProfileDto;
            profile: string;
        }>> {

        const { updateUser, profileString } = await this.userService.uploadProfilePicture(id, file);


        return APIResponse.update({
            updateUser,
            profile: profileString,
        }, "Profile pic uplode successfully")

    }


}
