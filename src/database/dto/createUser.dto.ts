import type { UserRole } from "./userRole.enum";

export class CreateUserDto{
    username:string;
    email:string;
    password:string;

    role? :UserRole
}