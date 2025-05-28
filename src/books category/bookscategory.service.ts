
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import type { CreateCategoryDto, UpdateCategoryDto } from 'src/database/dto';
import { Category } from 'src/database/entities';
import type { Repository, TreeRepository } from 'typeorm';

@Injectable()
export class BooksCategoryService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Category) private readonly treeCategoryRepository: TreeRepository<Category>,
    ){
        this.initilizeRoot()
    }


    private async initilizeRoot(): Promise<void>{
        const checkRoot: Category | null = await this.categoryRepository.findOne({
            where :{
                name : "Root"
            }
        });

        if (!checkRoot) {
            const createRoot: Category =  this.categoryRepository.create({
                name : "Root",
                description: "Main Root for Category",
                parent: null
            });

            if (!checkRoot) {
                throw new ConflictException("Problem occure create category");
            }
            this.categoryRepository.save(createRoot,);
        }
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>{
        let parent : Category | null = null;

        if (createCategoryDto.parentId) {
            parent = await this.categoryRepository.findOne({
                where: {
                    id: createCategoryDto.parentId
                }
            });

            if (!parent) {
                throw new NotFoundException("Parent category not found");
            }
        }

        const category: Category = this.categoryRepository.create({
            name: createCategoryDto.name,
            description: createCategoryDto.description,
            parent
        });
        return this.categoryRepository.save(category);
    }

    async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>{
        const category = await this.categoryRepository.findOne({
            where: {
                id
            }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (updateCategoryDto.parentId) {
            const parent = await this.categoryRepository.findOne({
                where: {
                    id: updateCategoryDto.parentId
                }
            });

           if (!parent) {
                throw new NotFoundException("Parent category not found");
            }

            category.parent = parent;
        }
        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category,);

    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['parent', 'children']
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }



    async getCategoryTree(): Promise<Category[]> {
        return this.treeCategoryRepository.findTrees();
    }

    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find({
            relations: ['parent', 'children']
        });
    }

     async deleteCategory(id: number): Promise<void> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['children']
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (category.children && category.children.length > 0) {
            throw new NotFoundException('Cannot delete category with children');
        }

        await this.categoryRepository.delete(id);
    }
}
