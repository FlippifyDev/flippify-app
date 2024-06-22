declare module 'bcryptjs' {
    export function genSaltSync(rounds?: number): string;
    export function hashSync(data: string, salt: string | number): string;
    export function compareSync(data: string, encrypted: string): boolean;
    export function genSalt(rounds: number, callback: (err: Error, salt: string) => void): void;
    export function hash(data: string, salt: string | number, callback: (err: Error, encrypted: string) => void): void;
    export function compare(data: string, encrypted: string): boolean;
}