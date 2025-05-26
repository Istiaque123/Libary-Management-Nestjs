import { Injectable, CanActivate, type ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Observable } from "rxjs";
import type { UserRole } from "src/database/dto";
import { ROLES_KEY } from "../decorators";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor (@Inject(Reflector)private readonly reflector: Reflector) { }


    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requirRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if (!requirRoles) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest();

        return requirRoles.some((role) => user.role === role);
    }

}