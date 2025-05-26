import { Request } from "express";
import type { User } from "src/database/entities";

export class RequestWithUser extends Request{
    user: User
}