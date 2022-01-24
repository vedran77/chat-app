/**
 * @description Vraca random string
 * @param {number} lenght duzina stringa koja nam je potrebna 
 * @returns random string
 */

export function getRandomString(length: number): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;
    
    let result: string = '';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
