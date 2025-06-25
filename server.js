// server.js - Código do seu backend para buscar a previsão do tempo e servir o Arsenal de Dados

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
    // É uma boa prática sair do processo se uma variável essencial não estiver definida em produção
    // if (process.env.NODE_ENV === 'production') { process.exit(1); }
}


// --- Definição dos Endpoints ---

// Endpoint para buscar a previsão do tempo (EXISTENTE)
app.get('/api/previsao/:cidade', async (req, res) => {
    const { cidade } = req.params;
    console.log(`[Servidor] Processando previsão para a cidade: "${cidade}"`);

    if (!apiKey) {
        console.error("[Servidor] Requisição '/api/previsao' falhou: Chave da API não configurada no servidor.");
        return res.status(500).json({ error: 'Chave da API OpenWeatherMap não configurada no servidor.' });
    }
    if (!cidade || cidade.trim() === '') {
        console.warn("[Servidor] Requisição '/api/previsao' falhou: Nome da cidade ausente ou vazio.");
        return res.status(400).json({ error: 'Nome da cidade é obrigatório.' });
    }

    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        console.log(`[Servidor] Chamando API OpenWeatherMap: ${weatherAPIUrl}`);
        const apiResponse = await axios.get(weatherAPIUrl);
        console.log(`[Servidor] Resposta recebida da OpenWeatherMap. Status: ${apiResponse.status}`);
        res.status(apiResponse.status).json(apiResponse.data);

    } catch (error) {
        console.error("[Servidor] Erro ao buscar previsão da OpenWeatherMap:", error.response?.data || error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Erro ao buscar previsão do tempo no servidor.';
        res.status(status).json({ error: message });
    }
});


// =================================================================
//          👇 SEUS DADOS MOCK (ARSENAL DE DADOS) 👇
// =================================================================

// Lista de veículos em destaque para a garagem
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
    {
        id: 12,
        modelo: "Porsche Taycan Turbo S",
        ano: 2023,
        destaque: "A eletricidade encontra a emoção Porsche.",
        imagemUrl: "https://files.porsche.com/filestore/image/multimedia/none/e3-taycan-gts-modelllaunch-kv-desktop/normal/b951333e-6701-11ec-80e9-005056bbfdcb/porsche-normal.jpg"
    },
    {
        id: 13,
        modelo: "Rivian R1T",
        ano: 2023,
        destaque: "Picape elétrica para aventura sem limites.",
        imagemUrl: "https://assets.rivian.com/2023/07/R1T-Landing-Page-Mobile_Desktop.webp"
    }
];

// Lista de serviços oferecidos pela garagem
const servicosOferecidos = [
    {
        id: "s1",
        nome: "Revisão Geral Completa",
        descricao: "Check-up abrangente de todos os sistemas do veículo, incluindo motor, freios, suspensão e eletrônica.",
        precoEstimado: "R$ 450,00"
    },
    {
        id: "s2",
        nome: "Troca de Óleo e Filtros",
        descricao: "Substituição do óleo do motor e de todos os filtros (óleo, ar, combustível e cabine).",
        precoEstimado: "R$ 180,00"
    },
    {
        id: "s3",
        nome: "Balanceamento e Alinhamento",
        descricao: "Ajuste das rodas para garantir desgaste uniforme dos pneus e melhor dirigibilidade.",
        precoEstimado: "R$ 120,00"
    },
    {
        id: "s4",
        nome: "Diagnóstico Computadorizado",
        descricao: "Uso de scanner automotivo para identificar falhas eletrônicas e problemas no motor.",
        precoEstimado: "R$ 150,00"
    },
    {
        id: "s5",
        nome: "Serviço de Freios",
        descricao: "Verificação e substituição de pastilhas, discos e fluido de freio.",
        precoEstimado: "R$ 300,00"
    }
];

// Lista de ferramentas essenciais
const ferramentasEssenciais = [
    {
        id: "f1",
        nome: "Chave de Roda Cruz",
        utilidade: "Essencial para remover e apertar parafusos de roda, ideal para emergências."
    },
    {
        id: "f2",
        nome: "Macaco Hidráulico",
        utilidade: "Permite levantar o veículo com segurança para trocar pneus ou realizar manutenções."
    },
    {
        id: "f3",
        nome: "Kit de Chaves Combinadas",
        utilidade: "Conjunto versátil de chaves para diversas aplicações, de reparos simples a mais complexos."
    },
    {
        id: "f4",
        nome: "Multímetro Digital",
        utilidade: "Fundamental para diagnosticar problemas elétricos e testar a bateria do veículo."
    },
    {
        id: "f5",
        nome: "Compressor de Ar Portátil",
        utilidade: "Ótimo para manter a pressão correta dos pneus, evitando desgaste irregular e economizando combustível."
    }
];

// Endpoint para retornar a lista de veículos em destaque
app.get('/api/garagem/veiculos-destaque', (req, res) => {
    console.log(`[Servidor] Requisição para /api/garagem/veiculos-destaque`);
    res.json(veiculosDestaque);
});

// Endpoint para retornar a lista de serviços oferecidos
app.get('/api/garagem/servicos-oferecidos', (req, res) => {
    console.log(`[Servidor] Requisição para /api/garagem/servicos-oferecidos`);
    res.json(servicosOferecidos);
});

// Endpoint para retornar a lista de ferramentas essenciais
app.get('/api/garagem/ferramentas-essenciais', (req, res) => {
    console.log(`[Servidor] Requisição para /api/garagem/ferramentas-essenciais`);
    res.json(ferramentasEssenciais);
});

// [OPCIONAL] Endpoint para buscar um SERVIÇO ESPECÍFICO por ID
app.get('/api/garagem/servicos-oferecidos/:idServico', (req, res) => {
    const { idServico } = req.params;
    console.log(`[Servidor] Requisição para /api/garagem/servicos-oferecidos/${idServico}`);
    const servico = servicosOferecidos.find(s => s.id === idServico);
    if (servico) {
        res.json(servico);
    } else {
        res.status(404).json({ error: `Serviço com ID ${idServico} não encontrado.` });
    }
});


// --- Iniciar o Servidor ---
// Faz o aplicativo Express começar a "ouvir" as requisições na porta definida
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
    console.log("Backend iniciado com sucesso!");
});