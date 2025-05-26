
import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import type { Repository } from 'typeorm';
import type { LoginDTO } from './dto';
import { UserRole } from 'src/common/types';






@Injectable()
export class AuthService {
    constructor(@Inject(JwtService) private readonly jwtService: JwtService,
                @InjectRepository(User) private readonly userRepository: Repository<User>){}

    async loginUser({email, password}: LoginDTO ) : Promise<string> {
        const user : User | null = await this.findUser(email);
        if(!user){
            throw new UnauthorizedException("User not found");
        }

        if (password === user.password) {
            const {password, ...tokenUser} = user;
            return this.jwtService.sign(tokenUser);
        }

        throw new HttpException("Invalid Credintial", HttpStatus.BAD_REQUEST);

    }



    async registerUser(userData: Partial<User>): Promise<User>{
        
        // check for existing user
        const existingUser = await this.userRepository.findOne({
            where: {
                email: userData.email
            }
        });

        if (existingUser) {
            throw new HttpException("User with this email already exists", HttpStatus.CONFLICT
            );
        }
        
        
        
        // proceed for creating user
        
        if (!userData.role) {
            userData.role = UserRole.USER;
        }
        
        

        
        const user: User =  this.userRepository.create(userData);

        
        if (!user){
            throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST)
        }
        return this.userRepository.save(user, );

    }

    async registerAdmin(userData: Partial<User>): Promise<User>{
        
        userData.role = UserRole.ADMIN;

        return await this.registerUser(userData);
    }

    private async findUser(email: string):Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });
        return user;
    }

    
}
