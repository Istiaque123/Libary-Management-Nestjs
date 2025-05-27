import { BookscategoryController } from './bookscategory.controller';


import { Module } from '@nestjs/common';
import { BookService } from 'src/book/book.service';
import { BooksCategoryService } from './bookscategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/database/entities';
import { AuthModule } from 'src/auth';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        AuthModule
    ],
    controllers: [
        BookscategoryController,
    ],
    providers: [BooksCategoryService],
})
export class BooksCategoryModule { }
