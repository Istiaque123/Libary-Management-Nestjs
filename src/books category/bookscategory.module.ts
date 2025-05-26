

import { Module } from '@nestjs/common';
import { BookService } from 'src/book/book.service';
import { BooksCategoryService } from './bookscategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/database/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category])
    ],
    controllers: [],
    providers: [BooksCategoryService],
})
export class BooksCategoryModule {}
