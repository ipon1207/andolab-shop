export class DomainError extends Error {
    readonly code: string;
    constructor(code: string, message?: string) {
        super(message ?? code);
        this.code = code;
    }
}

export class NotFoundError extends DomainError {
    constructor(entity: string = 'Resource') {
        super('NOT_FOUND', `${entity}が見つかりません`);
    }
}

export class NoStockError extends DomainError {
    constructor() {
        super('NO_STOCK', '在庫が不足しています');
    }
}
