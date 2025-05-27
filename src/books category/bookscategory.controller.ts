import { Controller, HttpStatus, Inject, Post, Get, Body, UseGuards, HttpCode, Param, Query } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard,  } from 'src/auth/guards/roles.guard';
import { BooksCategoryService } from '.';
import { Roles } from 'src/auth/decorators';
import { UserRole } from 'src/common/types';
import type { CategoryParemsDto, CreateCategoryDto, UpdateBookDto } from 'src/database/dto';
import { APIResponse } from 'src/common/dto';
import type { Category } from 'src/database/entities';

@Controller("book-categories")
@UseGuards(JwtGuard, RolesGuard)
export class BookscategoryController {
    constructor(@Inject(BooksCategoryService) private readonly bookCategoryService: BooksCategoryService){}

    @Post('create')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async createCategory(@Body() body: CreateCategoryDto): Promise<APIResponse<Category>>{
        const category = await this.bookCategoryService.createCategory(body);
        return APIResponse.created(category, "Category created successfully");
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async findAllCategory(): Promise<APIResponse<Category[]>>{
        const categories = await this.bookCategoryService.getAllCategories();
        return APIResponse.success(categories, "Categories retived successfully");
    }

    @Get('list')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async findListCategory(): Promise<APIResponse<Category[]>>{
        const categories = await this.bookCategoryService.getCategoryTree();
        return APIResponse.success(categories, "Categories list retived successfully")
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @HttpCode(HttpStatus.OK)
    async findOneCategory(@Param('id') id: string): Promise<APIResponse<Category>>{
        const category = await this.bookCategoryService.getCategoryById(+id);
        return APIResponse.success(category, "Category retrived successfully");
    }

    @Post("update")
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.ACCEPTED)
    async updateCategory(@Query() query: CategoryParemsDto, @Body() body: UpdateBookDto){
        const category = await this.bookCategoryService.updateCategory(query.categoryId, body);
        return APIResponse.update(category, "Category update successfully");
    }

    @Get("delete/:id")
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteCategory(@Param('id') id: number){
        await this.bookCategoryService.deleteCategory(+id);
        return APIResponse.delte("Category delete successfully");
    }



}
