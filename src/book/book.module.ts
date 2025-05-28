import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';


import { Module } from '@nestjs/common';
import { Book, BorrowRecord, Category, User } from 'src/database/entities';
import { BookService } from './book.service';
import { AuthModule } from 'src/auth';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Book,
            User,
            Category,
            BorrowRecord
        ]),
        // AuthModule
    ],
    controllers: [
        BookController,],
    providers: [
        BookService
    ],
})
export class BookModule { }
