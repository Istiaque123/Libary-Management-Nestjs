export class UserProfileDto{
    id:number;
    email:string;
    username:string;

    profilePicture?: string;
    role: string;
    createdAt: Date;


}