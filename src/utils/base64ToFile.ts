import fs from 'fs';
import path from 'path';

export async function base64ToImage(base64String: string, outputFilePath: string): Promise<void> {
    try {
        const base64Data = base64String.startsWith('data:image/') ?
            base64String.replace(/^data:image\/([A-Za-z-+\/]+);base64,/, '') :
            base64String;
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.resolve(outputFilePath);
        await fs.promises.writeFile(filePath, buffer);
        console.log(`Arquivo salvo com sucesso em ${filePath}`);
    } catch (error) {
        console.error('Erro ao salvar a imagem:', error);
        throw error;
    }
}
