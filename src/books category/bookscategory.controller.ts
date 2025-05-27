import { Controller, Inject, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BooksCategoryService } from '.';

@Controller("book-categories")
@UseGuards(JwtGuard, RolesGuard)
export class BookscategoryController {
    constructor(@Inject(BooksCategoryService) private readonly bookCategoryService: BooksCategoryService){}

    
}
