export function base64ToBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}


export function base64ToString(base64String: string): string {
    // Decode the base64 string into a byte array
    const decodedBytes = Buffer.from(base64String, 'base64');

    // Convert the byte array to a string assuming it's UTF-8 encoded
    const decodedString = decodedBytes.toString('utf-8');

    return decodedString;
}
