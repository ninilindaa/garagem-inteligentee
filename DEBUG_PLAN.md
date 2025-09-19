# Plano de Caça-Fantasmas - Garagem Inteligente

## Prioridade Alta (Bugs Críticos)
- [ ] **Problema:** Adicionar veículos não funciona.
  - **Hipótese:** O fetch POST para `/api/veiculos` está falhando ou o backend não está salvando.
  - **Como Investigar:** Verificar o console do navegador na aba 'Network' para ver o status da requisição. Usar `console.log` no endpoint do backend.
- [ ] **Problema:** Previsão do tempo não aparece.
  - **Hipótese:** A chave da API de clima pode estar errada ou a chamada `fetch` não está sendo feita corretamente.
  - **Como Investigar:** Verificar a aba 'Console' do navegador por erros de CORS ou 401 (Não Autorizado).

## Prioridade Média (Melhorias de UX)
- [ ] **Problema:** Layout confuso.
  - **Hipótese:** A disposição dos elementos não está clara.
  - **Como Investigar:** Pedir a um colega para navegar no site e apontar onde ele se sentiu perdido.

## Prioridade Baixa (Bugs Menores)
- [ ] **Problema:** O botão de turbo não funciona.
  - **Hipótese:** O `eventListener` do botão não está conectado à função correta.
  - **Como Investigar:** Inspecionar o elemento no navegador e verificar os `event listeners` associados.

---

> Adicione aqui outros bugs e hipóteses conforme os feedbacks recebidos do seu projeto.
