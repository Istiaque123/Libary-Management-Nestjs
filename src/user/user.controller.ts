
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
    Param
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole, type UpdateUserDto } from 'src/database/dto';
import { UserService } from './user.service';
import type { User } from 'src/database/entities';
import type { RequestWithUser } from 'src/common/types';
import { APIResponse } from 'src/common/dto';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {
    constructor (@Inject(UserService) private readonly userService: UserService) { }


    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
     @HttpCode(HttpStatus.FOUND)
    async getInfo(@Req()reqBody: RequestWithUser) {
        return{
            data: reqBody.user,
            message: "User Found",
            error: false,
            status: HttpStatus.FOUND
        }
    }
    
    @Post('update-user')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.ACCEPTED)
    async updateUserInfo(@Req()req: RequestWithUser, @Body() body: UpdateUserDto){

         await this.userService.updateUser(req.user.id, body);
        return APIResponse.update(null, "User update successfully")
        
    }

    @Get('delete')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Req()req: RequestWithUser){
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
    async getUserById(@Param('id', )id: number){
        const user: User = await this.userService.findOneById(+id);

        return APIResponse.found(user, "User found successfully");
    }

    @Post('update/:id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async updateById(@Param('id', ) id: number, @Body() body: UpdateUserDto){
        const user = await this.userService.updateUser(+id, body);
        
        return APIResponse.update(user, "Info update successful");
    }




}
