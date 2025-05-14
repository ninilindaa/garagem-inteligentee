// Adiciona um listener que garante que o DOM está pronto antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // =============== LÓGICA DE NAVEGAÇÃO DAS SEÇÕES DA GARAGEM UNIFICADA ===============
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const feedbackMessageEl = document.getElementById('feedback-message');

    function navigateTo(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        navButtons.forEach(button => {
            button.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        const activeButton = document.querySelector(`.nav-button[data-target-id="${sectionId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        console.log(`Navegando para: ${sectionId}`);
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.targetId;
            if (targetId) {
                navigateTo(targetId);
            }
        });
    });

    function showFeedback(message, type = 'info') {
        if (!feedbackMessageEl) return;
        feedbackMessageEl.textContent = message;
        feedbackMessageEl.className = `feedback feedback-${type}`;
        feedbackMessageEl.style.display = 'block';
        setTimeout(() => {
            feedbackMessageEl.style.display = 'none';
        }, 4000);
    }


    // =============== LÓGICA DE SELEÇÃO E EXIBIÇÃO DOS CARDS (GARAGEM DA BARBIE) ===============
    const seletorContainer = document.getElementById('selecao-veiculo');
    const todosVeiculosCards = document.querySelectorAll('.garagem .veiculo');
    const btnEsconder = document.getElementById('esconder-todos-btn');

    function esconderTodosVeiculos() {
        todosVeiculosCards.forEach(card => {
            card.classList.remove('visivel');
        });
        if (btnEsconder) {
            btnEsconder.style.display = 'none';
        }
    }

    if (seletorContainer) {
        seletorContainer.addEventListener('click', (event) => {
            const botaoClicado = event.target.closest('button[data-target-id]');
            if (botaoClicado) {
                const targetId = botaoClicado.dataset.targetId;
                const veiculoParaMostrar = document.getElementById(targetId);

                esconderTodosVeiculos();

                if (veiculoParaMostrar) {
                    veiculoParaMostrar.classList.add('visivel');
                    if (btnEsconder) {
                        btnEsconder.style.display = 'inline-flex';
                    }
                }
            }
        });
    }

    if (btnEsconder) {
        btnEsconder.addEventListener('click', esconderTodosVeiculos);
    }

    esconderTodosVeiculos();

    // =============== CLASSES DOS VEÍCULOS (GARAGEM DA BARBIE) ===============
    class Veiculo {
        constructor(modelo, cor, idPrefixo, maxVelocidadeVisual = 100) {
            this.modelo = modelo;
            this.cor = cor;
            this.ligado = false;
            this.velocidade = 0;
            this.idPrefixo = idPrefixo;
            this.maxVelocidadeVisual = maxVelocidadeVisual;

            this.elementos = {
                div: document.getElementById(`veiculo-${idPrefixo}`),
                modelo: document.getElementById(`${idPrefixo}-modelo`),
                cor: document.getElementById(`${idPrefixo}-cor`),
                ligado: document.getElementById(`${idPrefixo}-ligado`),
                velocidade: document.getElementById(`${idPrefixo}-velocidade`),
                velocidadeBar: document.getElementById(`${idPrefixo}-velocidade-bar`),
                ligarBtn: document.getElementById(`${idPrefixo}-ligar-btn`),
                desligarBtn: document.getElementById(`${idPrefixo}-desligar-btn`),
                acelerarBtn: document.getElementById(`${idPrefixo}-acelerar-btn`),
                frearBtn: document.getElementById(`${idPrefixo}-frear-btn`),
            };

            if (!this.elementos.div) {
                console.error(`Elemento principal do veículo não encontrado: veiculo-${idPrefixo}. Verifique os IDs no HTML.`);
                return;
            }
            this.atualizarUI();
        }

        ligar() {
            if (!this.ligado) {
                this.ligado = true;
                console.log(`${this.modelo} ligado.`);
                this.atualizarUI();
            }
        }

        desligar() {
            if (this.ligado) {
                this.ligado = false;
                this.velocidade = 0;
                console.log(`${this.modelo} desligado.`);
                this.atualizarUI();
            }
        }

        acelerar(incremento = 5) {
            if (this.ligado) {
                this.velocidade += incremento;
                const velocidadeParaBarra = Math.min(this.velocidade, this.maxVelocidadeVisual);
                console.log(`${this.modelo} acelerando para ${this.velocidade} km/h.`);
                this.atualizarUI(velocidadeParaBarra);
            } else {
                console.log(`${this.modelo} está desligado, não pode acelerar.`);
                showFeedback(`${this.modelo} está desligado! Ligue antes de acelerar.`, 'error');
            }
        }

        frear(decremento = 5) {
            if (this.velocidade > 0) {
                this.velocidade -= decremento;
                if (this.velocidade < 0) {
                    this.velocidade = 0;
                }
                const velocidadeParaBarra = Math.min(this.velocidade, this.maxVelocidadeVisual);
                console.log(`${this.modelo} freando para ${this.velocidade} km/h.`);
                this.atualizarUI(velocidadeParaBarra);
            }
        }

        atualizarUI(velocidadeParaBarra = this.velocidade) {
            if (!this.elementos.div) return;
            if (this.elementos.modelo) this.elementos.modelo.textContent = this.modelo;
            if (this.elementos.cor) this.elementos.cor.textContent = this.cor;
            if (this.elementos.ligado) this.elementos.ligado.textContent = this.ligado ? "Sim" : "Não";
            if (this.elementos.velocidade) this.elementos.velocidade.textContent = this.velocidade;
            if (this.elementos.velocidadeBar) {
                let percent = (Math.min(velocidadeParaBarra, this.maxVelocidadeVisual) / this.maxVelocidadeVisual) * 100;
                percent = Math.max(0, Math.min(100, percent));
                this.elementos.velocidadeBar.style.width = `${percent}%`;
            }
            if (this.elementos.ligarBtn) this.elementos.ligarBtn.disabled = this.ligado;
            if (this.elementos.desligarBtn) this.elementos.desligarBtn.disabled = !this.ligado;
            if (this.elementos.acelerarBtn) this.elementos.acelerarBtn.disabled = !this.ligado;
            if (this.elementos.frearBtn) this.elementos.frearBtn.disabled = !this.ligado || this.velocidade === 0;
        }

        adicionarListeners() {
            if (!this.elementos.div) return;
            this.elementos.ligarBtn?.addEventListener('click', () => this.ligar());
            this.elementos.desligarBtn?.addEventListener('click', () => this.desligar());
            this.elementos.acelerarBtn?.addEventListener('click', () => this.acelerar());
            this.elementos.frearBtn?.addEventListener('click', () => this.frear());
        }
    }

    class Caminhao extends Veiculo {
        constructor(modelo, cor, capacidadeCarga) {
            super(modelo, cor, "caminhao", 120);
            this.capacidadeCarga = capacidadeCarga;
            this.cargaAtual = 0;
            this.elementos.cargaMax = document.getElementById('caminhao-carga-max');
            this.elementos.cargaAtual = document.getElementById('caminhao-carga-atual');
            this.atualizarUI();
        }
        acelerar() { super.acelerar(3); }
        frear() { super.frear(4); }
        atualizarUI() {
            super.atualizarUI();
            if (!this.elementos.div) return;
            if (this.elementos.cargaMax) this.elementos.cargaMax.textContent = this.capacidadeCarga;
            if (this.elementos.cargaAtual) this.elementos.cargaAtual.textContent = this.cargaAtual;
        }
    }

    class Carro extends Veiculo {
        constructor(modelo, cor) {
            super(modelo, cor, "carro", 180);
        }
        acelerar() { super.acelerar(8); }
        frear() { super.frear(10); }
    }

    class CarroEsportivo extends Veiculo {
        constructor(modelo, cor) {
            super(modelo, cor, "esportivo", 300);
            this.turboAtivado = false;
            this.elementos.turbo = document.getElementById('esportivo-turbo');
            this.elementos.turboBtn = document.getElementById('esportivo-turbo-btn');
            this.atualizarUI();
        }
        ativarTurbo() {
            if (this.ligado && !this.turboAtivado) {
                this.turboAtivado = true;
                console.log(`${this.modelo} TURBO ATIVADO!`);
                showFeedback(`${this.modelo} TURBO ATIVADO!`, 'info');
                this.acelerar(50);
            } else if (this.turboAtivado) {
                this.desativarTurbo();
            } else if (!this.ligado) {
                showFeedback(`${this.modelo} está desligado! Ligue antes de ativar o turbo.`, 'error');
            }
            this.atualizarUI();
        }
        desativarTurbo() {
            if (this.turboAtivado) {
                this.turboAtivado = false;
                console.log(`${this.modelo} Turbo desativado.`);
                showFeedback(`${this.modelo} Turbo desativado.`, 'info');
                this.atualizarUI();
            }
        }
        acelerar(boost = 0) {
            const incrementoBase = 15;
            const incrementoTurbo = this.turboAtivado ? 25 : 0;
            super.acelerar(incrementoBase + incrementoTurbo + boost);
        }
        frear() { super.frear(20); }
        desligar() {
            this.desativarTurbo();
            super.desligar();
        }
        atualizarUI() {
            super.atualizarUI();
            if (!this.elementos.div) return;
            if (this.elementos.turbo) this.elementos.turbo.textContent = this.turboAtivado ? "ATIVO" : "Inativo";
            if (this.elementos.turboBtn) {
                this.elementos.turboBtn.disabled = !this.ligado;
                this.elementos.turboBtn.textContent = this.turboAtivado ? "Desativar Turbo" : "Ativar Turbo";
                this.elementos.turboBtn.classList.toggle('active', this.turboAtivado);
            }
            this.elementos.div?.classList.toggle('turbo-active', this.turboAtivado);
        }
        adicionarListeners() {
            super.adicionarListeners();
            this.elementos.turboBtn?.addEventListener('click', () => this.ativarTurbo());
        }
    }

    class Motocicleta extends Veiculo {
        constructor(modelo, cor) {
            super(modelo, cor, "moto", 220);
            this.boostAtivado = false;
            this.elementos.boost = document.getElementById('moto-boost');
            this.elementos.boostBtn = document.getElementById('moto-boost-btn');
            this.atualizarUI();
        }
        ativarBoost() {
            if (this.ligado && !this.boostAtivado) {
                this.boostAtivado = true;
                console.log(`${this.modelo} BOOST ATIVADO!`);
                showFeedback(`${this.modelo} BOOST ATIVADO!`, 'info');
                this.acelerar(30);
            } else if (this.boostAtivado) {
                this.desativarBoost();
            } else if (!this.ligado) {
                showFeedback(`${this.modelo} está desligado! Ligue antes de ativar o boost.`, 'error');
            }
            this.atualizarUI();
        }
        desativarBoost() {
            if (this.boostAtivado) {
                this.boostAtivado = false;
                console.log(`${this.modelo} Boost desativado.`);
                showFeedback(`${this.modelo} Boost desativado.`, 'info');
                this.atualizarUI();
            }
        }
        acelerar(boost = 0) {
            const incrementoBase = 10;
            const incrementoBoost = this.boostAtivado ? 15 : 0;
            super.acelerar(incrementoBase + incrementoBoost + boost);
        }
        frear() { super.frear(12); }
        desligar() {
            this.desativarBoost();
            super.desligar();
        }
        atualizarUI() {
            super.atualizarUI();
            if (!this.elementos.div) return;
            if (this.elementos.boost) this.elementos.boost.textContent = this.boostAtivado ? "ATIVO" : "Inativo";
            if (this.elementos.boostBtn) {
                this.elementos.boostBtn.disabled = !this.ligado;
                this.elementos.boostBtn.textContent = this.boostAtivado ? "Desativar Boost" : "Ativar Boost";
                this.elementos.boostBtn.classList.toggle('active', this.boostAtivado);
            }
            this.elementos.div?.classList.toggle('boost-active', this.boostAtivado);
        }
        adicionarListeners() {
            super.adicionarListeners();
            this.elementos.boostBtn?.addEventListener('click', () => this.ativarBoost());
        }
    }

    // =============== INICIALIZAÇÃO DOS VEÍCULOS (GARAGEM DA BARBIE) ===============
    const caminhao = new Caminhao("Scania R450", "Azul", 20000);
    const carro = new Carro("Onix", "Prata");
    const esportivo = new CarroEsportivo("Ferrari 488", "Vermelha");
    const moto = new Motocicleta("CB 500", "Preta");

    // <<< NOVO: Lista de todos os veículos instanciados
    const listaDeTodosOsVeiculos = [caminhao, carro, esportivo, moto];

    caminhao.adicionarListeners();
    carro.adicionarListeners();
    esportivo.adicionarListeners();
    moto.adicionarListeners();

    console.log("Garagem Inteligente Unificada carregada!");

    // =============== LÓGICA PARA AS OUTRAS SEÇÕES (ADICIONAR VEÍCULO, HISTÓRICO, AGENDAMENTO) ===============

    // <<< NOVO: Função para popular os <select> com os veículos
    function popularSelectsComVeiculos(veiculos) {
        const selectHistorico = document.getElementById('select-veiculo-historico');
        const selectAgendar = document.getElementById('select-veiculo-agendar');

        const selects = [selectHistorico, selectAgendar];

        selects.forEach(selectElement => {
            if (!selectElement) return;

            // Limpar opções antigas, mantendo a primeira ("-- Selecione --")
            while (selectElement.options.length > 1) {
                selectElement.remove(1);
            }

            // Adicionar cada veículo como uma nova opção
            veiculos.forEach(veiculo => {
                if (veiculo && veiculo.modelo && veiculo.idPrefixo) { // Garante que o veículo é válido
                    const option = document.createElement('option');
                    option.value = veiculo.idPrefixo; // Usar idPrefixo como valor é útil
                    option.textContent = veiculo.modelo; // Mostrar o nome do modelo
                    selectElement.appendChild(option);
                }
            });
        });
    }

    // <<< NOVO: Chamar a função para popular os selects
    popularSelectsComVeiculos(listaDeTodosOsVeiculos);


    // Exemplo: Formulário de Adicionar Veículo
    const formAddVeiculo = document.getElementById('form-add-veiculo');
    if (formAddVeiculo) {
        formAddVeiculo.addEventListener('submit', (event) => {
            event.preventDefault();
            const placa = document.getElementById('add-placa').value;
            const modelo = document.getElementById('add-modelo').value;
            // ... pegar outros valores
            console.log(`Novo veículo: Placa ${placa}, Modelo ${modelo}`);
            showFeedback(`Veículo ${modelo} (${placa}) adicionado com sucesso! (Simulação)`, 'success');
            formAddVeiculo.reset();
            // ATENÇÃO: Se você adicionar um novo veículo aqui, precisará
            // atualizar a 'listaDeTodosOsVeiculos' e chamar 'popularSelectsComVeiculos' novamente
            // para que o novo veículo apareça nos selects.
            // Por exemplo:
            // const novoVeiculoAdicionado = new Carro(modelo, "Cor Padrão"); // Ou outra classe
            // listaDeTodosOsVeiculos.push(novoVeiculoAdicionado);
            // popularSelectsComVeiculos(listaDeTodosOsVeiculos);
        });
    }

    const formAgendamento = document.getElementById('form-agendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', (event) => {
            event.preventDefault();
            const veiculoIdSelecionado = document.getElementById('select-veiculo-agendar').value;
            const dataAgendamento = document.getElementById('agenda-data').value;
            const descAgendamento = document.getElementById('agenda-descricao').value;

            if (!veiculoIdSelecionado) {
                showFeedback('Por favor, selecione um veículo para o agendamento.', 'error');
                return;
            }
            // Encontrar o nome do modelo do veículo a partir do ID para a mensagem
            const veiculoSelecionadoObj = listaDeTodosOsVeiculos.find(v => v.idPrefixo === veiculoIdSelecionado);
            const nomeModeloSelecionado = veiculoSelecionadoObj ? veiculoSelecionadoObj.modelo : veiculoIdSelecionado;

            console.log(`Agendamento: Veículo ID ${veiculoIdSelecionado}, Data ${dataAgendamento}, Descrição: ${descAgendamento}`);
            showFeedback(`Manutenção para ${nomeModeloSelecionado} agendada para ${dataAgendamento}! (Simulação)`, 'success');
            formAgendamento.reset();
        });
    }

    // <<< NOVO: Listener para o select de histórico (exemplo de como usar o valor)
    const selectHistoricoEl = document.getElementById('select-veiculo-historico');
    const historicoDetalhesEl = document.getElementById('historico-detalhes');

    if (selectHistoricoEl && historicoDetalhesEl) {
        selectHistoricoEl.addEventListener('change', function() {
            const veiculoIdSelecionado = this.value;
            if (veiculoIdSelecionado) {
                const veiculoSelecionadoObj = listaDeTodosOsVeiculos.find(v => v.idPrefixo === veiculoIdSelecionado);
                historicoDetalhesEl.innerHTML = `<p>Exibindo histórico para: <strong>${veiculoSelecionadoObj.modelo}</strong>.</p><p>(Lógica de busca de histórico aqui...)</p>`;
                // Aqui você implementaria a busca e exibição do histórico real
            } else {
                historicoDetalhesEl.innerHTML = `<p>Selecione um veículo para ver o histórico.</p>`;
            }
        });
    }


    // --- Inicialização ---
    navigateTo('secao-garagem');

}); // Fim do DOMContentLoaded
// Dentro do seu script.js

// Modifique a parte que exibe o histórico:
if (selectHistoricoEl && historicoDetalhesEl) {
    selectHistoricoEl.addEventListener('change', function() {
        const veiculoIdSelecionado = this.value;
        historicoDetalhesEl.innerHTML = ''; // Limpa antes de adicionar novo conteúdo

        if (veiculoIdSelecionado) {
            const veiculoSelecionadoObj = listaDeTodosOsVeiculos.find(v => v.idPrefixo === veiculoIdSelecionado);

            // SIMULAÇÃO DE DADOS DE HISTÓRICO (substitua pela sua lógica real)
            const historicoSimulado = [
                { data: "01/07/2024", servico: "Troca de óleo e filtro", custo: "250,00", obs: "Utilizado óleo 5W-30 sintético." },
                { data: "15/03/2024", servico: "Alinhamento e Balanceamento", custo: "120,00", obs: "Pneus dianteiros com desgaste." }
            ];
            // FIM DA SIMULAÇÃO

            if (historicoSimulado.length > 0) {
                historicoSimulado.forEach(item => {
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('historico-item', 'card'); // Adiciona as classes

                    const tituloH4 = document.createElement('h4');
                    tituloH4.textContent = `Manutenção em ${item.data}`; // Título do card

                    const servicoP = document.createElement('p');
                    servicoP.innerHTML = `<strong>Serviço:</strong> ${item.servico}`;

                    const custoP = document.createElement('p');
                    custoP.innerHTML = `<strong>Custo:</strong> R$ ${item.custo}`;

                    const obsP = document.createElement('p');
                    obsP.innerHTML = `<strong>Observações:</strong> ${item.obs}`;

                    cardDiv.appendChild(tituloH4);
                    cardDiv.appendChild(servicoP);
                    cardDiv.appendChild(custoP);
                    cardDiv.appendChild(obsP);

                    historicoDetalhesEl.appendChild(cardDiv);
                });
            } else {
                historicoDetalhesEl.innerHTML = `<p class="placeholder-text">Nenhum histórico de manutenção encontrado para ${veiculoSelecionadoObj.modelo}.</p>`;
            }

        } else {
            historicoDetalhesEl.innerHTML = `<p class="placeholder-text">Selecione um veículo para ver o histórico.</p>`;
        }
    });
}

// Lógica similar seria necessária para a 'lista-agendamentos'
// Você precisaria de uma função para buscar/simular os agendamentos e renderizá-los como cards.
// Exemplo para agendamentos:
const listaAgendamentosDiv = document.getElementById('lista-agendamentos');

function exibirAgendamentos(agendamentos) { // agendamentos seria um array de objetos
    if (!listaAgendamentosDiv) return;
    
    // Encontra e remove o placeholder se existir
    const placeholder = listaAgendamentosDiv.querySelector('.placeholder-text');
    if (placeholder) placeholder.remove();

    // Remove agendamentos antigos antes de adicionar novos
    const agendamentosAntigos = listaAgendamentosDiv.querySelectorAll('.agendamento-item.card');
    agendamentosAntigos.forEach(card => card.remove());


    if (agendamentos && agendamentos.length > 0) {
        agendamentos.forEach(ag => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('agendamento-item', 'card');

            const tituloH4 = document.createElement('h4');
            // Supondo que 'ag' tem propriedades 'data', 'veiculoNome', 'servicoDescricao'
            tituloH4.textContent = `Agendado para: ${ag.data} - ${ag.veiculoNome || 'Veículo'}`;

            const servicoP = document.createElement('p');
            servicoP.innerHTML = `<strong>Serviço:</strong> ${ag.servicoDescricao}`;
            
            // Exemplo de botões de ação
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');
            
            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-sm', 'btn-edit');
            editButton.textContent = 'Editar'; // Poderia adicionar ícone: <i class="fas fa-edit"></i> Editar
            // editButton.onclick = () => { /* lógica para editar agendamento */ };

            const cancelButton = document.createElement('button');
            cancelButton.classList.add('btn', 'btn-sm', 'btn-danger');
            cancelButton.textContent = 'Cancelar'; // <i class="fas fa-times-circle"></i> Cancelar
            // cancelButton.onclick = () => { /* lógica para cancelar agendamento */ };

            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(cancelButton);

            cardDiv.appendChild(tituloH4);
            cardDiv.appendChild(servicoP);
            cardDiv.appendChild(actionsDiv);

            listaAgendamentosDiv.appendChild(cardDiv);
        });
    } else {
        if (!listaAgendamentosDiv.querySelector('.placeholder-text')) { // Adiciona placeholder se não houver e nenhum agendamento
             const p = document.createElement('p');
             p.classList.add('placeholder-text');
             p.textContent = "Nenhum agendamento futuro.";
             listaAgendamentosDiv.appendChild(p);
        }
    }
}

// No seu formAgendamento.addEventListener('submit', ...):
// Após adicionar um agendamento (simulado ou real), você chamaria:
// const agendamentosAtuais = [ {data: "15/08/2024", veiculoNome: nomeModeloSelecionado, servicoDescricao: descAgendamento}, ...outrosAgendamentos ];
// exibirAgendamentos(agendamentosAtuais);
// Lembre-se de persistir esses dados (localStorage ou backend) e recarregá-los ao iniciar.

// Para exibir agendamentos ao carregar a página (simulação):
let agendamentosSalvos = []; // Você carregaria isso do localStorage ou backend
// Exemplo:
// agendamentosSalvos.push({data: "20/08/2024", veiculoNome: "Onix", servicoDescricao: "Trocar Pneus"});
// exibirAgendamentos(agendamentosSalvos); // Chamar isso no DOMContentLoaded se houver dados
// Inicialmente, pode deixar o placeholder, e quando um agendamento for adicionado, a função exibirAgendamentos cuidará de mostrar.

// Para que o form de agendamento atualize a lista:
if (formAgendamento) {
    formAgendamento.addEventListener('submit', (event) => {
        event.preventDefault();
        const veiculoIdSelecionado = document.getElementById('select-veiculo-agendar').value;
        const dataAgendamentoInput = document.getElementById('agenda-data').value;
        const descAgendamento = document.getElementById('agenda-descricao').value;

        if (!veiculoIdSelecionado) {
            showFeedback('Por favor, selecione um veículo para o agendamento.', 'error');
            return;
        }
        if (!dataAgendamentoInput) {
            showFeedback('Por favor, selecione uma data para o agendamento.', 'error');
            return;
        }

        const veiculoSelecionadoObj = listaDeTodosOsVeiculos.find(v => v.idPrefixo === veiculoIdSelecionado);
        const nomeModeloSelecionado = veiculoSelecionadoObj ? veiculoSelecionadoObj.modelo : veiculoIdSelecionado;
        
        // Formatar data para exibição
        const dataObj = new Date(dataAgendamentoInput + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso ao formatar
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});


        const novoAgendamento = {
            data: dataFormatada, // Usa a data formatada
            veiculoNome: nomeModeloSelecionado,
            servicoDescricao: descAgendamento,
            id: Date.now() // Um ID simples para o exemplo
        };

        // Adicionar à lista (e persistir se estiver usando localStorage)
        agendamentosSalvos.push(novoAgendamento);
        // localStorage.setItem('agendamentos', JSON.stringify(agendamentosSalvos)); // Exemplo de persistência

        exibirAgendamentos(agendamentosSalvos); // Atualiza a UI

        console.log(`Agendamento: Veículo ${nomeModeloSelecionado}, Data ${dataFormatada}, Descrição: ${descAgendamento}`);
        showFeedback(`Manutenção para ${nomeModeloSelecionado} agendada para ${dataFormatada}! (Simulação)`, 'success');
        formAgendamento.reset();
    });
}
// Carregar agendamentos do localStorage ao iniciar (exemplo)
function carregarAgendamentosIniciais() {
    const dadosSalvos = localStorage.getItem('agendamentos');
    if (dadosSalvos) {
        agendamentosSalvos = JSON.parse(dadosSalvos);
        exibirAgendamentos(agendamentosSalvos);
    } else {
        // Garante que o placeholder seja exibido se não houver agendamentos salvos
        const placeholderExistente = listaAgendamentosDiv?.querySelector('.placeholder-text');
        if (listaAgendamentosDiv && !placeholderExistente && listaAgendamentosDiv.children.length <=1 ) { // <=1 para contar o H3
            const p = document.createElement('p');
            p.classList.add('placeholder-text');
            p.textContent = "Nenhum agendamento futuro.";
            listaAgendamentosDiv.appendChild(p);
        }
    }
}
// Chamar no final do DOMContentLoaded
carregarAgendamentosIniciais();
// ... todo o seu código JavaScript ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (outras inicializações e lógicas) ...

    // --- Inicialização da Navegação ---
    // Define a seção inicial a ser exibida ao carregar a página
    navigateTo('secao-garagem'); // <--- Linha a ser modificada

}); // Fim do DOMContentLoaded`
// =============== LÓGICA DA PREVISÃO DO TEMPO INTERATIVA ===============

const API_KEY_WEATHER = 'SUA_CHAVE_API_OPENWEATHERMAP_AQUI'; // IMPORTANTE: Substitua pela sua chave!
const cidadePrevisaoInput = document.getElementById('cidadePrevisaoInput');
const buscarClimaBtn = document.getElementById('buscarPrevisaoBtn'); // Nome do botão no HTML
const previsaoTempoContainer = document.getElementById('previsaoTempoContainer');
const previsaoPlaceholder = document.getElementById('previsaoPlaceholder');
// const erroPrevisaoContainer = document.getElementById('erroPrevisaoContainer'); // Se for usar um container de erro específico

const filtroDiasPrevisaoContainer = document.getElementById('filtroDiasPrevisao');
const chkDestacarChuva = document.getElementById('chkDestacarChuva');
const chkDestacarFrio = document.getElementById('chkDestacarFrio');
const chkDestacarCalor = document.getElementById('chkDestacarCalor');

let todosOsDadosDaPrevisaoProcessados = [];
let numDiasParaExibirPrevisao = 5; // Default é 5 dias
let destacarChuvaPrevisao = false;
let destacarFrioPrevisao = false;
let destacarCalorPrevisao = false;
const LIMITE_TEMP_FRIA_PREVISAO = 10;
const LIMITE_TEMP_QUENTE_PREVISAO = 30;
let cidadePrevisaoAtual = 'Curitiba'; // Cidade padrão inicial
let previsaoJaBuscadaParaCidadeAtual = false;


/**
 * @JSDoc
 * Formata a data para Dia da Semana e DD/MM.
 * @param {string} dt_txt - A string de data/hora da API (ex: "2024-07-28 12:00:00").
 * @returns {{diaSemana: string, dataFormatada: string}}
 */
function formatarDataPrevisao(dt_txt) {
    const dataObj = new Date(dt_txt);
    const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''); // 'Seg' em vez de 'Seg.'
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1), dataFormatada };
}


/**
 * @JSDoc
 * Processa os dados brutos da API OpenWeatherMap para um formato diário mais amigável.
 * @param {Array} list - A lista de previsões de 3 horas da API.
 * @returns {Array} - Um array de objetos, cada um representando um dia de previsão.
 */
function processarDadosForecastPrevisao(list) {
    const previsaoDiariaAgrupada = {};

    list.forEach(item => {
        const data = item.dt_txt.split(' ')[0];
        if (!previsaoDiariaAgrupada[data]) {
            previsaoDiariaAgrupada[data] = {
                temps: [],
                weatherDetails: [],
                dt_txt_primeiro: item.dt_txt // Para referência e ordenação
            };
        }
        previsaoDiariaAgrupada[data].temps.push(item.main.temp);
        previsaoDiariaAgrupada[data].weatherDetails.push({
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            main: item.weather[0].main.toLowerCase() // Ex: 'rain', 'clouds'
        });
    });

    return Object.keys(previsaoDiariaAgrupada).map(dataKey => {
        const diaInfo = previsaoDiariaAgrupada[dataKey];
        const tempMin = Math.min(...diaInfo.temps);
        const tempMax = Math.max(...diaInfo.temps);

        // Tenta pegar o ícone e descrição do meio-dia (índice 4 se houver 8 medições) ou o mais representativo.
        // Ou o primeiro se não houver meio-dia exato.
        const weatherPrincipal = diaInfo.weatherDetails[Math.floor(diaInfo.weatherDetails.length / 2)] || diaInfo.weatherDetails[0];

        const contemChuva = diaInfo.weatherDetails.some(w => w.main.includes('rain') || w.description.includes('chuva'));
        const { diaSemana, dataFormatada } = formatarDataPrevisao(diaInfo.dt_txt_primeiro);

        return {
            dataCompleta: diaInfo.dt_txt_primeiro,
            diaSemana: diaSemana,
            dataFormatada: dataFormatada,
            temp_min: tempMin,
            temp_max: tempMax,
            descricao: weatherPrincipal.description.charAt(0).toUpperCase() + weatherPrincipal.description.slice(1),
            icone: weatherPrincipal.icon,
            contemChuva: contemChuva
        };
    }).slice(0, 5); // Garante que pegamos no máximo 5 dias
}


/**
 * @JSDoc
 * Renderiza os cards da previsão no DOM com base nos filtros e destaques atuais.
 */
function renderizarPrevisaoTempo() {
    previsaoTempoContainer.innerHTML = ''; // Limpa o container

    if (previsaoPlaceholder) previsaoPlaceholder.style.display = 'none'; // Esconde placeholder

    if (todosOsDadosDaPrevisaoProcessados.length === 0) {
        if (previsaoPlaceholder) {
            previsaoPlaceholder.textContent = "Nenhuma previsão disponível ou erro na busca.";
            previsaoPlaceholder.style.display = 'block';
        } else {
            previsaoTempoContainer.innerHTML = '<p class="placeholder-text">Nenhuma previsão disponível ou erro na busca.</p>';
        }
        return;
    }

    const dadosParaExibir = todosOsDadosDaPrevisaoProcessados.slice(0, numDiasParaExibirPrevisao);

    if (dadosParaExibir.length === 0) {
        previsaoTempoContainer.innerHTML = '<p class="placeholder-text">Nenhum dado de previsão para os filtros selecionados.</p>';
        return;
    }

    dadosParaExibir.forEach(dia => {
        const card = document.createElement('div');
        card.classList.add('card-previsao-dia'); // Usa a classe CSS que definimos

        // Aplicar classes de destaque
        if (destacarChuvaPrevisao && dia.contemChuva) card.classList.add('dia-chuvoso');
        if (destacarFrioPrevisao && dia.temp_min < LIMITE_TEMP_FRIA_PREVISAO) card.classList.add('temp-baixa');
        if (destacarCalorPrevisao && dia.temp_max > LIMITE_TEMP_QUENTE_PREVISAO) card.classList.add('temp-alta');

        card.innerHTML = `
            <h4>${dia.diaSemana}</h4>
            <p class="data-formatada">${dia.dataFormatada}</p>
            <img src="http://openweathermap.org/img/wn/${dia.icone}@2x.png" alt="${dia.descricao}">
            <p class="descricao-clima">${dia.descricao}</p>
            <div class="temperaturas">
                <p><span class="label-temp">Max:</span> ${dia.temp_max.toFixed(0)}°C</p>
                <p><span class="label-temp">Min:</span> ${dia.temp_min.toFixed(0)}°C</p>
            </div>
        `;
        previsaoTempoContainer.appendChild(card);
    });
}

/**
 * @JSDoc
 * Trata erros da API de previsão, usando a função showFeedback existente.
 * @param {string} mensagem - A mensagem de erro.
 */
function tratarErroPrevisao(mensagem) {
    showFeedback(mensagem, 'error'); // Reutiliza sua função de feedback
    todosOsDadosDaPrevisaoProcessados = []; // Limpa dados antigos
    renderizarPrevisaoTempo(); // Tenta renderizar (mostrará placeholder de erro)
}


/**
 * @JSDoc
 * Busca os dados da previsão do tempo detalhada para uma cidade e processa.
 * @param {string} cidade - O nome da cidade.
 */
async function buscarEProcessarPrevisaoTempo(cidade) {
    if (!cidade) {
        tratarErroPrevisao('Por favor, digite o nome de uma cidade.');
        return;
    }

    // Limpa feedback de erro anterior da previsão
    // Se estiver usando o feedbackMessageEl global, não precisa limpar aqui especificamente,
    // mas se tivesse um erroPrevisaoContainer, limparia ele.
    // O showFeedback já tem um timeout, então não precisa se preocupar muito.

    if (previsaoPlaceholder) {
        previsaoPlaceholder.textContent = "Buscando previsão...";
        previsaoPlaceholder.style.display = 'block';
    }
    previsaoTempoContainer.innerHTML = ''; // Limpa cards antigos

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${API_KEY_WEATHER}&units=metric&lang=pt_br`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Erro ${response.status}`;
            if (response.status === 404) throw new Error(`Cidade "${cidade}" não encontrada.`);
            if (response.status === 401) throw new Error('Chave da API de previsão inválida/não autorizada.');
            throw new Error(`Erro ao buscar previsão: ${errorMessage}`);
        }
        const data = await response.json();
        if (!data.list || data.list.length === 0) {
            throw new Error('Não há dados de previsão disponíveis para esta cidade.');
        }

        todosOsDadosDaPrevisaoProcessados = processarDadosForecastPrevisao(data.list);
        cidadePrevisaoAtual = cidade; // Atualiza a cidade atual após sucesso
        previsaoJaBuscadaParaCidadeAtual = true;
        renderizarPrevisaoTempo();

    } catch (error) {
        console.error('Falha ao buscar previsão do tempo:', error);
        tratarErroPrevisao(error.message);
        previsaoJaBuscadaParaCidadeAtual = false;
    }
}

// --- Event Listeners para os Controles da Previsão ---

if (buscarClimaBtn) {
    buscarClimaBtn.addEventListener('click', () => {
        const cidade = cidadePrevisaoInput.value.trim();
        buscarEProcessarPrevisaoTempo(cidade);
    });
}

if (cidadePrevisaoInput) {
    cidadePrevisaoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const cidade = cidadePrevisaoInput.value.trim();
            buscarEProcessarPrevisaoTempo(cidade);
        }
    });
}


if (filtroDiasPrevisaoContainer) {
    filtroDiasPrevisaoContainer.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button[data-dias]');
        if (targetButton) {
            filtroDiasPrevisaoContainer.querySelectorAll('button[data-dias]').forEach(btn => btn.classList.remove('active-filter'));
            targetButton.classList.add('active-filter');
            numDiasParaExibirPrevisao = parseInt(targetButton.dataset.dias);
            renderizarPrevisaoTempo();
        }
    });
}

if (chkDestacarChuva) {
    chkDestacarChuva.addEventListener('change', (event) => {
        destacarChuvaPrevisao = event.target.checked;
        renderizarPrevisaoTempo();
    });
}
if (chkDestacarFrio) {
    chkDestacarFrio.addEventListener('change', (event) => {
        destacarFrioPrevisao = event.target.checked;
        renderizarPrevisaoTempo();
    });
}
if (chkDestacarCalor) {
    chkDestacarCalor.addEventListener('change', (event) => {
        destacarCalorPrevisao = event.target.checked;
        renderizarPrevisaoTempo();
    });
}

// Modificar a função navigateTo para lidar com a carga inicial da previsão
const originalNavigateTo = navigateTo; // Guarda a referência da função original
navigateTo = function(sectionId) { // Sobrescreve a função navigateTo
    originalNavigateTo(sectionId); // Chama a lógica original de navegação

    if (sectionId === 'secao-previsao-tempo' && !previsaoJaBuscadaParaCidadeAtual) {
        // Se a seção de previsão for ativada e ainda não buscamos para a cidade padrão (ou a última buscada)
        // pode-se buscar automaticamente para a cidade padrão.
        // Opcional: verificar se o input de cidade está vazio para não sobrescrever uma busca iniciada pelo usuário
        if (cidadePrevisaoInput && !cidadePrevisaoInput.value.trim() && cidadePrevisaoAtual) {
             cidadePrevisaoInput.value = cidadePrevisaoAtual; // Preenche o input com a cidade padrão
             buscarEProcessarPrevisaoTempo(cidadePrevisaoAtual);
        } else if (todosOsDadosDaPrevisaoProcessados.length > 0) {
            // Se já temos dados (de uma busca anterior), apenas renderiza
            renderizarPrevisaoTempo();
        } else if (previsaoPlaceholder) {
             previsaoPlaceholder.textContent = "Digite uma cidade para ver a previsão.";
             previsaoPlaceholder.style.display = 'block';
             previsaoTempoContainer.innerHTML = '';
        }
    }
};

// Configuração inicial para a seção de previsão (ex: botão de 5 dias ativo)
// Isso é feito no HTML com a classe 'active-filter' no botão de 5 dias.

// =============== FIM DA LÓGICA DA PREVISÃO DO TEMPO INTERATIVA ===============

// Adiciona um listener que garante que o DOM está pronto antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // =============== LÓGICA DE NAVEGAÇÃO DAS SEÇÕES DA GARAGEM UNIFICADA ===============
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const feedbackMessageEl = document.getElementById('feedback-message');

    // ... (sua função navigateTo existente e seu listener para navButtons)

    // Mantenha sua função navigateTo como está, mas vamos adicionar um
    // tratamento específico para a 'secao-garagem' mais abaixo,
    // ou dentro dela se preferir.


    // =============== LÓGICA DE SELEÇÃO E EXIBIÇÃO DOS CARDS (GARAGEM DA BARBIE) ===============
    const seletorContainer = document.getElementById('selecao-veiculo'); // Seu nome original
    const todosVeiculosCards = document.querySelectorAll('.garagem .veiculo');
    const btnEsconder = document.getElementById('esconder-todos-btn'); // Seu nome original

    // NOVO: Referência ao botão que vai iniciar a visualização da garagem
    const btnIniciarVisualizacaoGaragem = document.getElementById('btnIniciarVisualizacaoGaragem');
    const containerBotaoIniciarGaragem = document.getElementById('container-botao-iniciar-garagem');


    function esconderTodosVeiculos() {
        todosVeiculosCards.forEach(card => {
            card.classList.remove('visivel');
            card.classList.remove('destacado'); // Se você usa essa classe
        });
        if (btnEsconder) {
            btnEsconder.style.display = 'none';
        }
    }

    // Função para resetar a visualização da garagem para o estado inicial
    function resetarVisualizacaoGaragem() {
        esconderTodosVeiculos(); // Esconde cards de veículos
        if (seletorContainer) {
            seletorContainer.style.display = 'none'; // Esconde a seleção de veículos
        }
        if (containerBotaoIniciarGaragem) {
            containerBotaoIniciarGaragem.style.display = 'block'; // Mostra o botão "Ver Minha Garagem"
        }
        if (btnEsconder) { // Garante que o botão de esconder veículo específico também suma
            btnEsconder.style.display = 'none';
        }
    }


    // Estado inicial ao carregar a página (ou ao navegar para a seção)
    // Vamos chamar resetarVisualizacaoGaragem() quando a seção garagem for ativada
    // Isso será feito na função navigateTo modificada abaixo

    // Listener para o NOVO botão "Ver Minha Garagem"
    if (btnIniciarVisualizacaoGaragem) {
        btnIniciarVisualizacaoGaragem.addEventListener('click', () => {
            if (seletorContainer) {
                seletorContainer.style.display = 'block'; // Mostra a seleção de veículos
            }
            if (containerBotaoIniciarGaragem) {
                containerBotaoIniciarGaragem.style.display = 'none'; // Esconde o botão "Ver Minha Garagem"
            }
            // Não esconde os veículos aqui, pois o usuário ainda vai escolher
        });
    }


    if (seletorContainer) {
        seletorContainer.addEventListener('click', (event) => {
            const botaoClicado = event.target.closest('button[data-target-id]');
            if (botaoClicado) {
                const targetId = botaoClicado.dataset.targetId;
                const veiculoParaMostrar = document.getElementById(targetId);

                esconderTodosVeiculos(); // Esconde qualquer veículo que já estivesse visível

                if (veiculoParaMostrar) {
                    veiculoParaMostrar.classList.add('visivel');
                    if (veiculoParaMostrar.classList.contains('veiculo')) { // Se você tem a classe 'destacado'
                        veiculoParaMostrar.classList.add('destacado');
                    }
                    if (btnEsconder) {
                        btnEsconder.style.display = 'inline-flex'; // Mostra o botão "Esconder Veículo"
                    }
                }
            }
            // Se o clique foi no botão "Esconder Veículo" (que agora está DENTRO de #selecao-veiculo)
            // A lógica de esconder já está no listener do btnEsconder abaixo.
        });
    }

    if (btnEsconder) {
        btnEsconder.addEventListener('click', () => {
            // Ao clicar em "Esconder Veículo" (o que está DENTRO de #selecao-veiculo)
            esconderTodosVeiculos(); // Esconde o card do veículo
            // E volta para o estado inicial da garagem, mostrando o botão "Ver Minha Garagem"
            resetarVisualizacaoGaragem();
        });
    }

    // Sua função esconderTodosVeiculos() já é chamada no início do script,
    // mas vamos garantir o estado completo com resetarVisualizacaoGaragem
    // ao entrar na seção.

    // ... (suas classes Veiculo, Caminhao, etc. e suas inicializações) ...


    // MODIFICAÇÃO NA SUA FUNÇÃO navigateTo EXISTENTE
    // Se sua função navigateTo está definida como: function navigateTo(sectionId) { ... }
    // Modifique-a assim:

    // Salve a referência da sua função original se ela já existe no escopo global ou de módulo
    // Se ela está definida DENTRO do DOMContentLoaded, podemos modificá-la diretamente.
    // Supondo que `navigateTo` é a função que você já tem:
    const suaFuncaoNavigateToOriginal = navigateTo; // Guardamos a original

    navigateTo = function(sectionId) { // Criamos uma nova que "envolve" a original
        suaFuncaoNavigateToOriginal(sectionId); // Primeiro, executa a navegação normal

        // Lógica específica para a seção da garagem
        if (sectionId === 'secao-garagem') {
            resetarVisualizacaoGaragem(); // Configura o estado inicial da garagem
        }
        // Adicione aqui a lógica para a previsão do tempo se necessário, como antes
        else if (sectionId === 'secao-previsao-tempo') {
            // ... sua lógica para carregar a previsão ao entrar na seção ...
            // Exemplo simplificado:
            if (typeof buscarEProcessarPrevisaoTempo === 'function' && !previsaoJaBuscadaParaCidadeAtual) {
                if (cidadePrevisaoInput && !cidadePrevisaoInput.value.trim() && cidadePrevisaoAtual) {
                     cidadePrevisaoInput.value = cidadePrevisaoAtual;
                     buscarEProcessarPrevisaoTempo(cidadePrevisaoAtual);
                } else if (todosOsDadosDaPrevisaoProcessados && todosOsDadosDaPrevisaoProcessados.length > 0) {
                    renderizarPrevisaoTempo();
                } else if (previsaoPlaceholder) {
                     previsaoPlaceholder.textContent = "Digite uma cidade para ver a previsão.";
                     previsaoPlaceholder.style.display = 'block';
                     if(previsaoTempoContainer) previsaoTempoContainer.innerHTML = '';
                }
            }
        }
        // Adicione 'else if' para outras seções se precisar de tratamento especial ao entrar nelas
    };


    // --- Inicialização ---
    // Sua chamada original para navigateTo deve estar aqui, por exemplo:
    // navigateTo('secao-garagem'); // Agora essa chamada já usará a versão modificada
    // Se você chama navigateTo('secao-garagem') no final do script, ela já vai
    // usar a versão "decorada" que chama resetarVisualizacaoGaragem.

    // Garanta que a primeira seção ativa no HTML (secao-garagem) tenha o estado visual correto no carregamento inicial
    // Se 'secao-garagem' for a primeira a ser mostrada.
    if (document.getElementById('secao-garagem').classList.contains('active')) {
        resetarVisualizacaoGaragem();
    }
// =============== LÓGICA DA PREVISÃO DO TEMPO INTERATIVA ===============

const API_KEY_WEATHER = 'SUA_CHAVE_API_OPENWEATHERMAP_AQUI'; // IMPORTANTE: Substitua pela sua chave!
const cidadePrevisaoInput = document.getElementById('cidadePrevisaoInput');
const buscarClimaBtn = document.getElementById('buscarPrevisaoBtn'); // Nome do botão no HTML
const previsaoTempoContainer = document.getElementById('previsaoTempoContainer');
const previsaoPlaceholder = document.getElementById('previsaoPlaceholder');
// const erroPrevisaoContainer = document.getElementById('erroPrevisaoContainer'); // Se for usar um container de erro específico

const filtroDiasPrevisaoContainer = document.getElementById('filtroDiasPrevisao');
const chkDestacarChuva = document.getElementById('chkDestacarChuva');
const chkDestacarFrio = document.getElementById('chkDestacarFrio');
const chkDestacarCalor = document.getElementById('chkDestacarCalor');

let todosOsDadosDaPrevisaoProcessados = [];
let numDiasParaExibirPrevisao = 5; // Default é 5 dias
let destacarChuvaPrevisao = false;
let destacarFrioPrevisao = false;
let destacarCalorPrevisao = false;
const LIMITE_TEMP_FRIA_PREVISAO = 10;
const LIMITE_TEMP_QUENTE_PREVISAO = 30;
let cidadePrevisaoAtual = 'Curitiba'; // Cidade padrão inicial
let previsaoJaBuscadaParaCidadeAtual = false;


/**
 * @JSDoc
 * Formata a data para Dia da Semana e DD/MM.
 * @param {string} dt_txt - A string de data/hora da API (ex: "2024-07-28 12:00:00").
 * @returns {{diaSemana: string, dataFormatada: string}}
 */
function formatarDataPrevisao(dt_txt) {
    const dataObj = new Date(dt_txt);
    const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''); // 'Seg' em vez de 'Seg.'
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1), dataFormatada };
}


/**
 * @JSDoc
 * Processa os dados brutos da API OpenWeatherMap para um formato diário mais amigável.
 * @param {Array} list - A lista de previsões de 3 horas da API.
 * @returns {Array} - Um array de objetos, cada um representando um dia de previsão.
 */
function processarDadosForecastPrevisao(list) {
    const previsaoDiariaAgrupada = {};

    list.forEach(item => {
        const data = item.dt_txt.split(' ')[0];
        if (!previsaoDiariaAgrupada[data]) {
            previsaoDiariaAgrupada[data] = {
                temps: [],
                weatherDetails: [],
                dt_txt_primeiro: item.dt_txt // Para referência e ordenação
            };
        }
        previsaoDiariaAgrupada[data].temps.push(item.main.temp);
        previsaoDiariaAgrupada[data].weatherDetails.push({
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            main: item.weather[0].main.toLowerCase() // Ex: 'rain', 'clouds'
        });
    });

    return Object.keys(previsaoDiariaAgrupada).map(dataKey => {
        const diaInfo = previsaoDiariaAgrupada[dataKey];
        const tempMin = Math.min(...diaInfo.temps);
        const tempMax = Math.max(...diaInfo.temps);

        // Tenta pegar o ícone e descrição do meio-dia (índice 4 se houver 8 medições) ou o mais representativo.
        // Ou o primeiro se não houver meio-dia exato.
        const weatherPrincipal = diaInfo.weatherDetails[Math.floor(diaInfo.weatherDetails.length / 2)] || diaInfo.weatherDetails[0];

        const contemChuva = diaInfo.weatherDetails.some(w => w.main.includes('rain') || w.description.includes('chuva'));
        const { diaSemana, dataFormatada } = formatarDataPrevisao(diaInfo.dt_txt_primeiro);

        return {
            dataCompleta: diaInfo.dt_txt_primeiro,
            diaSemana: diaSemana,
            dataFormatada: dataFormatada,
            temp_min: tempMin,
            temp_max: tempMax,
            descricao: weatherPrincipal.description.charAt(0).toUpperCase() + weatherPrincipal.description.slice(1),
            icone: weatherPrincipal.icon,
            contemChuva: contemChuva
        };
    }).slice(0, 5); // Garante que pegamos no máximo 5 dias
}


/**
 * @JSDoc
 * Renderiza os cards da previsão no DOM com base nos filtros e destaques atuais.
 */
function renderizarPrevisaoTempo() {
    previsaoTempoContainer.innerHTML = ''; // Limpa o container

    if (previsaoPlaceholder) previsaoPlaceholder.style.display = 'none'; // Esconde placeholder

    if (todosOsDadosDaPrevisaoProcessados.length === 0) {
        if (previsaoPlaceholder) {
            previsaoPlaceholder.textContent = "Nenhuma previsão disponível ou erro na busca.";
            previsaoPlaceholder.style.display = 'block';
        } else {
            previsaoTempoContainer.innerHTML = '<p class="placeholder-text">Nenhuma previsão disponível ou erro na busca.</p>';
        }
        return;
    }

    const dadosParaExibir = todosOsDadosDaPrevisaoProcessados.slice(0, numDiasParaExibirPrevisao);

    if (dadosParaExibir.length === 0) {
        previsaoTempoContainer.innerHTML = '<p class="placeholder-text">Nenhum dado de previsão para os filtros selecionados.</p>';
        return;
    }

    dadosParaExibir.forEach(dia => {
        const card = document.createElement('div');
        card.classList.add('card-previsao-dia'); // Usa a classe CSS que definimos

        // Aplicar classes de destaque
        if (destacarChuvaPrevisao && dia.contemChuva) card.classList.add('dia-chuvoso');
        if (destacarFrioPrevisao && dia.temp_min < LIMITE_TEMP_FRIA_PREVISAO) card.classList.add('temp-baixa');
        if (destacarCalorPrevisao && dia.temp_max > LIMITE_TEMP_QUENTE_PREVISAO) card.classList.add('temp-alta');

        card.innerHTML = `
            <h4>${dia.diaSemana}</h4>
            <p class="data-formatada">${dia.dataFormatada}</p>
            <img src="http://openweathermap.org/img/wn/${dia.icone}@2x.png" alt="${dia.descricao}">
            <p class="descricao-clima">${dia.descricao}</p>
            <div class="temperaturas">
                <p><span class="label-temp">Max:</span> ${dia.temp_max.toFixed(0)}°C</p>
                <p><span class="label-temp">Min:</span> ${dia.temp_min.toFixed(0)}°C</p>
            </div>
        `;
        previsaoTempoContainer.appendChild(card);
    });
}

/**
 * @JSDoc
 * Trata erros da API de previsão, usando a função showFeedback existente.
 * @param {string} mensagem - A mensagem de erro.
 */
function tratarErroPrevisao(mensagem) {
    showFeedback(mensagem, 'error'); // Reutiliza sua função de feedback
    todosOsDadosDaPrevisaoProcessados = []; // Limpa dados antigos
    renderizarPrevisaoTempo(); // Tenta renderizar (mostrará placeholder de erro)
}


/**
 * @JSDoc
 * Busca os dados da previsão do tempo detalhada para uma cidade e processa.
 * @param {string} cidade - O nome da cidade.
 */
async function buscarEProcessarPrevisaoTempo(cidade) {
    if (!cidade) {
        tratarErroPrevisao('Por favor, digite o nome de uma cidade.');
        return;
    }

    // Limpa feedback de erro anterior da previsão
    // Se estiver usando o feedbackMessageEl global, não precisa limpar aqui especificamente,
    // mas se tivesse um erroPrevisaoContainer, limparia ele.
    // O showFeedback já tem um timeout, então não precisa se preocupar muito.

    if (previsaoPlaceholder) {
        previsaoPlaceholder.textContent = "Buscando previsão...";
        previsaoPlaceholder.style.display = 'block';
    }
    previsaoTempoContainer.innerHTML = ''; // Limpa cards antigos

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${API_KEY_WEATHER}&units=metric&lang=pt_br`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Erro ${response.status}`;
            if (response.status === 404) throw new Error(`Cidade "${cidade}" não encontrada.`);
            if (response.status === 401) throw new Error('Chave da API de previsão inválida/não autorizada.');
            throw new Error(`Erro ao buscar previsão: ${errorMessage}`);
        }
        const data = await response.json();
        if (!data.list || data.list.length === 0) {
            throw new Error('Não há dados de previsão disponíveis para esta cidade.');
        }

        todosOsDadosDaPrevisaoProcessados = processarDadosForecastPrevisao(data.list);
        cidadePrevisaoAtual = cidade; // Atualiza a cidade atual após sucesso
        previsaoJaBuscadaParaCidadeAtual = true;
        renderizarPrevisaoTempo();

    } catch (error) {
        console.error('Falha ao buscar previsão do tempo:', error);
        tratarErroPrevisao(error.message);
        previsaoJaBuscadaParaCidadeAtual = false;
    }
}

// --- Event Listeners para os Controles da Previsão ---

if (buscarClimaBtn) {
    buscarClimaBtn.addEventListener('click', () => {
        const cidade = cidadePrevisaoInput.value.trim();
        buscarEProcessarPrevisaoTempo(cidade);
    });
}

if (cidadePrevisaoInput) {
    cidadePrevisaoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const cidade = cidadePrevisaoInput.value.trim();
            buscarEProcessarPrevisaoTempo(cidade);
        }
    });
}


if (filtroDiasPrevisaoContainer) {
    filtroDiasPrevisaoContainer.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button[data-dias]');
        if (targetButton) {
            filtroDiasPrevisaoContainer.querySelectorAll('button[data-dias]').forEach(btn => btn.classList.remove('active-filter'));
            targetButton.classList.add('active-filter');
            numDiasParaExibirPrevisao = parseInt(targetButton.dataset.dias);
            renderizarPrevisaoTempo();
        }
    });
}

if (chkDestacarChuva) {
    chkDestacarChuva.addEventListener('change', (event) => {
        destacarChuvaPrevisao = event.target.checked;
        renderizarPrevisaoTempo();
    });
}

if (chkDestacarFrio) {
    chkDestacarFrio.addEventListener('change', (event) => {
        destacarFrioPrevisao = event.target.checked;
        renderizarPrevisaoTempo();
    });
}

if (chkDestacarCalor) {
    chkDestacarCalor.addEventListener('change', (event) => {
        destacarCalorPrevisao = event.target.checked;
        renderizarPrevisaoTempo();
    });
}

// Modificar a função navigateTo para lidar com a carga inicial da previsão
const originalNavigateTo = navigateTo; // Guarda a referência da função original
navigateTo = function(sectionId) { // Sobrescreve a função navigateTo
    originalNavigateTo(sectionId); // Chama a lógica original de navegação

    if (sectionId === 'secao-previsao-tempo' && !previsaoJaBuscadaParaCidadeAtual) {
        // Se a seção de previsão for ativada e ainda não buscamos para a cidade padrão (ou a última buscada)
        // pode-se buscar automaticamente para a cidade padrão.
        // Opcional: verificar se o input de cidade está vazio para não sobrescrever uma busca iniciada pelo usuário
        if (cidadePrevisaoInput && !cidadePrevisaoInput.value.trim() && cidadePrevisaoAtual) {
             cidadePrevisaoInput.value = cidadePrevisaoAtual; // Preenche o input com a cidade padrão
             buscarEProcessarPrevisaoTempo(cidadePrevisaoAtual);
        } else if (todosOsDadosDaPrevisaoProcessados.length > 0) {
            // Se já temos dados (de uma busca anterior), apenas renderiza
            renderizarPrevisaoTempo();
        } else if (previsaoPlaceholder) {
             previsaoPlaceholder.textContent = "Digite uma cidade para ver a previsão.";
             previsaoPlaceholder.style.display = 'block';
             previsaoTempoContainer.innerHTML = '';
        }
    }
};

// Configuração inicial para a seção de previsão (ex: botão de 5 dias ativo)
// Isso é feito no HTML com a classe 'active-filter' no botão de 5 dias.

// =============== FIM DA LÓGICA DA PREVISÃO DO TEMPO INTERATIVA ===============

}); // Fim do DOMContentLoaded