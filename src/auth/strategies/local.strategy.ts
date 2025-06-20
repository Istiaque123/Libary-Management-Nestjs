import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){

    constructor(@Inject(AuthService) private readonly authService: AuthService){
        super({
            usernameField: "email"
        })
    }




    async validate(email: string, password: string){
        const user = await this.authService.loginUser({email, password});
        return user;
        
    }

}