
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
// import { writeFileSync } from 'fs';
// import path from 'path';
import type { UpdateUserDto } from 'src/database/dto';
import { User } from 'src/database/entities';
import type { Repository, UpdateResult } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';
import type { UserProfileDto } from './dto';

@Injectable()
export class UserService {
    constructor (@InjectRepository(User) private readonly userRepository: Repository<User>) { }


    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        const user: User | null = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        const tempUser: UpdateResult = await this.userRepository.update(id, updateUserDto);

        return tempUser;
    }

    async findOneById(id: number): Promise<User> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                id,
            }
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return user;
    }


    async findOneByEmail(email: string): Promise<User> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                email,
            }
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return user;
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async deleteById(id: number) {
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return await this.userRepository.delete(id);
    }



    async uploadProfilePicture(id: number, file: Express.Multer.File): Promise<{
    updateUser: UserProfileDto;
    profileString: string;
}> {
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }


        const profileDir = path.resolve(__dirname, '..', '..', 'Uploads', 'profile-pictures');

        try{
            if (!fs.existsSync(profileDir)) {
                fs.mkdirSync(profileDir, {recursive: true});
                log(`crete directory: ${profileDir}`);
            }
        }catch(e){
            log(`Error for creating directory: ${e.message}`);
            throw new Error(`Cannot create directory: ${profileDir}`);
        }


        const profileString = `uploads/profile-pictures/${file.originalname}`;

        await fs.writeFileSync(`./${profileString}`, file.buffer);

        // log(profileString);
  
        user.profilePicture = profileString;
        const tempUser = await this.userRepository.save(user);
        
        const updateUser: UserProfileDto = {
            id: tempUser.id,
            username: tempUser.username,
            email: tempUser.email,
            profilePicture: tempUser.profilePicture,
            createdAt: tempUser.createdAt,
            role: tempUser.role
        };

        return {updateUser, profileString};
    
    }

}
