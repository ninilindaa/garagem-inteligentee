// Exemplo modificando a função carregarVeiculosDestaque

async function carregarVeiculosDestaque() {
    // PISTA 1: A função foi chamada?
    console.log("Tentando carregar veículos destaque..."); 
    
    const container = document.getElementById('cards-veiculos-destaque');
    container.innerHTML = '<p>Carregando destaques...</p>';
    try {
        const response = await fetch(`${backendUrl}/api/garagem/veiculos-destaque`);
        if (!response.ok) throw new Error('Falha ao buscar veículos destaque.');
        const veiculos = await response.json();

        // PISTA 2: O que o backend enviou?
        console.log("Dados dos veículos recebidos:", veiculos); 

        container.innerHTML = '';
        
        // PISTA 3: O código está tentando exibir os dados?
        if (veiculos.length === 0) {
            console.log("Array de veículos está vazio. Exibindo mensagem.");
        }

        veiculos.forEach(veiculo => {
            // PISTA 4: O loop está rodando? (Deve aparecer para cada veículo)
            console.log("Criando card para:", veiculo.modelo); 

            const card = document.createElement('div');
            card.className = 'veiculo-card';
            card.innerHTML = `
                <img src="${veiculo.imagemUrl}" alt="${veiculo.modelo}">
                <h3>${veiculo.modelo} (${veiculo.ano})</h3>
                <p>${veiculo.destaque}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p style="color:red;">${error.message}</p>`;
        // PISTA 5: Ocorreu um erro no bloco try?
        console.error("ERRO no bloco catch de carregarVeiculosDestaque:", error);
    }
}