import sha512 from 'crypto-js/sha256';

class Hash {
    public static createHash(plainPassword: string): string {
        return sha512(plainPassword).toString();
    }

    public static check(plainPassword: string, hashedPw: string): boolean {
        return Hash.createHash(plainPassword) === hashedPw;
    }
}

export { Hash }
