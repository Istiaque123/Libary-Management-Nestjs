
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
    BadRequestException
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


    // @Post('upload-profile-picture/:id')
    // @HttpCode(HttpStatus.ACCEPTED)
    // @Roles(UserRole.ADMIN, UserRole.USER)
    // @UseInterceptors(FileInterceptor('profilePicture', multerConfig))
    // async uploadProfilePicture(
    //     @Param("id") id: number,

    //     @UploadedFile(
    //         new ParseFilePipe({
    //     validators: [
    //       new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
    //       new FileTypeValidator({ fileType: /^(image\/jpeg|image\/jpg|image\/png)$/ }),
    //     ],
    //             errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    //         }),) 
    //         file: Express.Multer.File
    // ){
    //     const user = await this.userService.uploadProfilePicture(+id, file);

    //     log(file);
    //     log(user.profilePicture);
    //     return APIResponse.success({
    //         user: user,
    //         profilePicture: user.profilePicture
    //     });
    // }


@Post('upload-profile-picture')
@UseInterceptors(FileInterceptor('profilePicture', multerConfig))
async uploadProfilePicture(
  @Req() req: RequestWithUser,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB

        // Fixed validator syntax
        // new FileTypeValidator({
        //   fileType: /^image\/(jpe?g|png)$/i
        // })
      ],
      exceptionFactory: (errors) => new BadRequestException({
        message: 'File validation failed',
        errors
      })
    }),
  )
  file: Express.Multer.File
) {
  // Debug log to verify file details
  log('Uploaded file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path
  });

  // Fixed service method name to match your actual service
//   const user = await this.userService.uploadProfilePicture(
//     req.user.id,
//     file.filename // or file.path depending on your needs
//   );

//   return {
//     success: true,
//     message: 'Profile picture uploaded successfully',
//     data: {
//       profilePictureUrl: `/uploads/profile-pictures/${file.filename}`,
//       userId: user.id
//     }
//   };
}

    @Post('upload')
    @UseInterceptors(FileInterceptor('profilePicture')) // field name must match frontend form
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        
        const uploadPath = `./uploads/${file.originalname}`;
        await writeFile(uploadPath, file.buffer);

        log(uploadPath);

        return {
            originalname: file.originalname,
            filename: file.filename,
            path: uploadPath,
        };
    }

}
