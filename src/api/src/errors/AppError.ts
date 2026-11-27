// Erro "esperado" da aplicação: carrega o status HTTP que deve ser devolvido.
export class AppError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}
