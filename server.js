// server.js - Código do seu backend para buscar a previsão do tempo

// Importações dos módulos necessários
// Certifique-se de que você rodou 'npm install express dotenv axios cors' no terminal na pasta do projeto
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors'; // Importa o módulo CORS para permitir requisições do frontend

// Carrega variáveis de ambiente do arquivo .env
// Isso lê o arquivo .env na raiz do projeto e adiciona suas variáveis (como OPENWEATHER_API_KEY) a process.env
dotenv.config();

// Inicializa o aplicativo Express
// 'app' é a instância do seu servidor web
const app = express();

// Define a porta em que o servidor vai "ouvir" (receber requisições)
// process.env.PORT será usado pelo Render na nuvem; 3001 é a porta padrão para testes locais
const port = process.env.PORT || 3001;

// Pega a chave da API da OpenWeatherMap das variáveis de ambiente (carregadas do .env)
const apiKey = process.env.OPENWEATHER_API_KEY;

// --- Middlewares ---
// Middlewares são funções que o Express executa ANTES de chegar na lógica do seu endpoint
// Este middleware configura o CORS (Cross-Origin Resource Sharing)
// Ele permite que o seu frontend (rodando no navegador, possivelmente em um endereço/porta diferente)
// faça requisições para este backend sem que o navegador as bloqueie por segurança.
// Em um ambiente de produção real, você trocaria '*' pela URL específica do seu frontend.
app.use(cors());

// Opcional: Middleware para logs básicos de requisições recebidas (útil para depuração)
app.use((req, res, next) => {
    console.log(`[Servidor] Requisição recebida: ${req.method} ${req.url}`);
    next(); // Continua para o próximo middleware ou para o endpoint correspondente
});


// Verifica se a chave da API foi carregada (para ajudar na depuração inicial)
console.log(`[Servidor] Chave da API OpenWeatherMap carregada? ${!!apiKey ? 'Sim' : 'Não'}`);
if (!apiKey) {
    console.error("[Servidor] ERRO GRAVE: Chave da API OpenWeatherMap não encontrada nas variáveis de ambiente (.env). Verifique seu arquivo .env e as variáveis de ambiente do sistema/Render.");
    // Poderíamos adicionar aqui um tratamento para não iniciar o servidor se a chave for essencial
    // if (!apiKey) { process.exit(1); } // Isso sairia do processo Node.js se a chave não estiver lá
}


// --- Definição do Endpoints ---

// Define um endpoint GET para a rota '/api/previsao/:cidade'
// ':cidade' é um parâmetro dinâmico que será parte da URL (ex: /api/previsao/Curitiba)
app.get('/api/previsao/:cidade', async (req, res) => {
    // Extrai o valor do parâmetro 'cidade' da URL da requisição
    const { cidade } = req.params;

    console.log(`[Servidor] Processando previsão para a cidade: "${cidade}"`);

    // --- Validações ---
    // Verifica se a chave da API está disponível no ambiente do servidor
    if (!apiKey) {
        console.error("[Servidor] Requisição '/api/previsao' falhou: Chave da API não configurada no servidor.");
        // Retorna um erro 500 (Erro Interno do Servidor) se a chave não estiver configurada
        return res.status(500).json({ error: 'Chave da API OpenWeatherMap não configurada no servidor.' });
    }
    // Verifica se o nome da cidade foi fornecido na URL
    if (!cidade || cidade.trim() === '') {
        console.warn("[Servidor] Requisição '/api/previsao' falhou: Nome da cidade ausente ou vazio.");
        // Retorna um erro 400 (Requisição Inválida) se a cidade não for fornecida
        return res.status(400).json({ error: 'Nome da cidade é obrigatório.' });
    }

    // --- Chamada para a API Externa (OpenWeatherMap) ---
    // Monta a URL completa para a API de previsão de 5 dias / 3 horas da OpenWeatherMap
    // Usa a cidade fornecida e a chave da API segura do backend
    // encodeURIComponent garante que nomes de cidades com espaços ou caracteres especiais funcionem na URL
    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        console.log(`[Servidor] Chamando API OpenWeatherMap: ${weatherAPIUrl}`);
        // Faz a requisição GET para a API OpenWeatherMap usando o pacote axios
        const apiResponse = await axios.get(weatherAPIUrl);
        console.log(`[Servidor] Resposta recebida da OpenWeatherMap. Status: ${apiResponse.status}`);

        // --- Resposta para o Frontend ---
        // Envia os dados recebidos da OpenWeatherMap de volta para o frontend que chamou este endpoint
        // Mantém o mesmo status HTTP que a API externa retornou (ex: 200 para sucesso)
        res.status(apiResponse.status).json(apiResponse.data);

    } catch (error) {
        // --- Tratamento de Erros da Chamada para a API Externa ---
        console.error("[Servidor] Erro ao buscar previsão da OpenWeatherMap:", error.response?.data || error.message);

        // Tenta extrair o status e a mensagem de erro da resposta da API externa, se houver
        // Se não houver resposta (ex: erro de rede do backend ao tentar chamar a API externa), usa defaults
        const status = error.response?.status || 500; // Se a API externa retornou um status (ex: 404 Not Found), usa ele. Senão, é um erro 500 interno do nosso servidor.
        const message = error.response?.data?.message || 'Erro ao buscar previsão do tempo no servidor.'; // Pega a mensagem de erro da API externa ou uma mensagem padrão.

        // Envia a mensagem de erro de volta para o frontend com o status HTTP apropriado
        res.status(status).json({ error: message });
    }
});


// --- Iniciar o Servidor ---
// Faz o aplicativo Express começar a "ouvir" as requisições na porta definida
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
    console.log("Backend iniciado com sucesso!");
});


// =================================================================
//          👇 COLE ESTE BLOCO NO SEU server.js 👇
// =================================================================

// ARSENAL DE DADOS DA GARAGEM (DADOS MOCK)

// DENTRO DO SEU server.js

const veiculosDestaque = [
    { 
        id: 10, 
        modelo: "Mustang Mach-E", 
        ano: 2024, 
        destaque: "Performance Elétrica com Alma de Mustang.", 
        imagemUrl: "https://www.ford.com/is/image/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang-mach-e/2023/collections/dm/23_mst_mache_sel_34frnt_vapor_blue.tif?croppathe=1_3x2&wid=720" 
    },
    { 
        id: 11, 
        modelo: "Tesla Cybertruck", 
        ano: 2024, 
        destaque: "O futuro da resistência e utilidade.", 
        imagemUrl: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Cybertruck-Main-Hero-Desktop-LHD.jpg" 
    },
    // ... e outros veículos que você adicionar aqui
];

// DENTRO DO SEU server.js

app.get('/api/garagem/veiculos-destaque', (req, res) => {
    res.json(veiculosDestaque);
});