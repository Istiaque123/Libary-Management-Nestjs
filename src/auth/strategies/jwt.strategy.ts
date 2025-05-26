import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "abc123"
        });
    }

    validate(payLoad: any): unknown {
        return {
            id: payLoad.id,
            email: payLoad.email,
            username:payLoad.username,
            role: payLoad.role,
            createdAt: payLoad.createdAt
        };
    }

}