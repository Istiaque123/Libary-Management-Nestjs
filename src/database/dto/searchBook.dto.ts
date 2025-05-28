import type { BookStateus } from "src/common/types";

export class SearchBookDto{
    title?: string;
    author?: string;
    categoryId?: number;
    categoryName: string;
    status?: BookStateus;
    includeSimilar?: boolean = true;
}