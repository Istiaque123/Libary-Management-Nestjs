
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { UpdateUserDto } from 'src/database/dto';
import { User } from 'src/database/entities';
import type { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
    constructor (@InjectRepository(User) private readonly userRepository: Repository<User>) { }


    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult>{
        const user: User | null = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        const tempUser:UpdateResult = await this.userRepository.update(id, updateUserDto);

        return tempUser;
    }

    async findOneById(id:number): Promise<User>{
        const user: User | null =  await this.userRepository.findOne({
            where: {
                id,
            }
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return user;
    }

    
    async findOneByEmail(email: string): Promise<User>{
          const user: User | null =  await this.userRepository.findOne({
            where: {
                email,
            }
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return user;
    }

    async findAll():Promise<User[]> {
        return await this.userRepository.find();
    }

    async deleteById(id:number){
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return await this.userRepository.delete(id);
    }


}
