import type { BookStateus } from "src/common/types";

export class UpdateBookDto{
    title?:string;
    description?: string;
    author?: string;
    serialNumber?: string;
    edition?:string;
    price?:number;
    categoryId?: number;
    status?: BookStateus
}