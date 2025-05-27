import { Controller, Inject, UseGuards, Post, Get, Req, Body, HttpCode, HttpStatus, Query, Param } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BookService } from './book.service';
import { Roles } from 'src/auth/decorators';
import { UserRole } from 'src/common/types';
import type { BorrowBookDto, CreateBookDto, DeleteBookDto, SearchBookDto, UpdateBookDto } from 'src/database/dto';
import { APIResponse } from 'src/common/dto';

@Controller("books")
@UseGuards(JwtGuard, RolesGuard)
export class BookController {
    constructor (@Inject(BookService) private readonly bookService: BookService) { }


    @Post('create')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async creatBook(@Body() body: CreateBookDto) {
        const book = await this.creatBook(body);
        return APIResponse.created(body, "Book created successfully");
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const books = await this.bookService.getAllBooks();
        return APIResponse.success(books, "Books retrieved successfully", HttpStatus.FOUND);
    }

    @Get('search')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.FOUND)
    async searchBook(@Query() searchBookQuery: SearchBookDto) {
        const book = await this.bookService.searchBooks(searchBookQuery);
        APIResponse.success(book, "Book found");
    }

    @Get('book/:id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.FOUND)
    async foundOne(@Param('id') id: string) {
        const book = await this.bookService.getBookById(+id);
        return APIResponse.found(book, "Book found successfuly")
    }

    @Post('update/:id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.ACCEPTED)
    async updateBook(@Param('id') id: string, @Body() reqBody: UpdateBookDto) {
        const book = await this.bookService.updateBook(+id, reqBody);
        return APIResponse.update(book, "Book update successfuly");
    }

    @Post('borrow/:id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async borrowBook(@Param('id') id: string, @Body() reqBody: BorrowBookDto) {
        const book = await this.bookService.borrowBook(+id, reqBody);
        return APIResponse.success(book, "Book borrowed successfully");
    }

    @Post('return/:id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async returnBook(@Param('id') id: string) {
        const book = await this.bookService.returnBook(+id);
        return APIResponse.success(book, "Book return successfully");
    }

    @Post('delete')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)

    async deleteBook(@Body() body: DeleteBookDto) {
        await this.bookService.deleteBook(body.bookId);
        return APIResponse.delte("Booke deleted successfully")
    }


}
