export interface IQueryParams {
    page: number;
    limit: number;
    q?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export class PaginatedResult<T> {
    public readonly meta: PaginationMeta;

    constructor(
        public readonly data: T[],
        public readonly params: IQueryParams,
        public readonly total: number
    ) {
        this.meta = this._buildMeta();
    }

    private _buildMeta(): PaginationMeta {
        const { page, limit } = this.params;
        const totalPages = Math.ceil(this.total / limit);

        return {
            page,
            limit,
            total: this.total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }
}
