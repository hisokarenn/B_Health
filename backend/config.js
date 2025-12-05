import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envResult = dotenv.config({ path: path.resolve(__dirname, '.env') });

if (envResult.error) {
    console.error("ERRO GRAVE DO DOTENV: Não foi possível carregar o .env", envResult.error);
} else if (envResult.parsed) {
    console.log(`[config.js] Carregou ${Object.keys(envResult.parsed).length} variável(is) do .env com sucesso.`);
}