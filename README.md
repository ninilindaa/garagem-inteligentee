# Garagem Inteligente da Barbie - Backend Turbinado

Este projeto é uma aplicação completa de gerenciamento de garagem com um backend Node.js/Express.

## Como Executar

1.  **Clone o repositório.**
2.  **Instale as dependências do backend:**
    ```bash
    npm install
    ```
3.  **Crie um arquivo `.env`** e adicione sua chave da API OpenWeatherMap:
    ```
    OPENWEATHER_API_KEY=sua_chave_secreta_aqui
    ```
4.  **Inicie o servidor backend:**
    ```bash
    node server.js
    ```
5.  **Abra o arquivo `public/index.html`** em seu navegador.

---

## Documentação da API

### Endpoint de Previsão do Tempo (Existente)

-   **Método:** `GET`
-   **Caminho:** `/api/previsao/:cidade`
-   **Descrição:** Atua como um proxy seguro para a API OpenWeatherMap, buscando a previsão do tempo para a cidade especificada.
-   **Exemplo de Resposta (Sucesso `200 OK`):**
    ```json
    { "city": { "name": "Curitiba" }, "list": [ ... ] }
    ```

### Endpoints de Dicas de Manutenção (NOVOS)

#### 1. Obter Dicas Gerais

-   **Método:** `GET`
-   **Caminho:** `/api/dicas-manutencao`
-   **Descrição:** Retorna uma lista de dicas de manutenção gerais, aplicáveis a qualquer veículo.
-   **Exemplo de Resposta (Sucesso `200 OK`):**
    ```json
    [
        { "id": 1, "dica": "Verifique o nível do óleo do motor regularmente." },
        { "id": 2, "dica": "Calibre os pneus semanalmente para economizar combustível e aumentar a segurança." }
    ]
    ```

#### 2. Obter Dicas por Tipo de Veículo

-   **Método:** `GET`
-   **Caminho:** `/api/dicas-manutencao/:tipoVeiculo`
-   **Parâmetros de Rota:**
    -   `tipoVeiculo` (string): O tipo do veículo. Valores aceitos no projeto: `carro`, `carroesportivo`, `moto`, `caminhao`.
-   **Descrição:** Retorna uma lista de dicas de manutenção específicas para o tipo de veículo informado.
-   **Exemplo de Resposta (Sucesso `200 OK` para `/api/dicas-manutencao/moto`):**
    ```json
    [
        { "id": 20, "dica": "Lubrifique e ajuste a tensão da corrente frequentemente." }
    ]
    ```
-   **Exemplo de Resposta (Erro `404 Not Found` para `/api/dicas-manutencao/bicicleta`):**
    ```json
    {
        "error": "Nenhuma dica específica encontrada para o tipo: bicicleta"
    }
    ```