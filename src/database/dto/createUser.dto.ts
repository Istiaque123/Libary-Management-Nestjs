import type { UserRole } from "../../common/types/userRole.enum";

export class CreateUserDto{
    username:string;
    email:string;
    password:string;

    role? :UserRole
}