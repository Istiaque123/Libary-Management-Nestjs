import type { BookStateus } from "src/common/types";

export class SearchBookDto{
    title?: string;
    author?: string;
    categoryId?: number;
    status?: BookStateus;
    includeSimilar?: boolean = true;
}