import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';


import { Module } from '@nestjs/common';
import { Book, Category, User } from 'src/database/entities';
import { BookService } from './book.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Book,
            User,
            Category,
        ])
    ],
    controllers: [
        BookController,],
    providers: [
        BookService
    ],
})
export class BookModule { }
