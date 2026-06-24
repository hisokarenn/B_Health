const {
    abrirDetalheCampanha
} = require('./helpers/navigation');

describe('Tela de Detalhe da Campanha', () => {

    before(async () => {

        await abrirDetalheCampanha();

    });

    it('deve exibir o título da campanha', async () => {

        const titulo = await $('~campanha-detalhe-titulo');

        await expect(titulo).toBeDisplayed();

    });

    it('deve exibir o botão GPS', async () => {

        const gps = await $('~campanha-detalhe-botao-gps');

        await expect(gps).toBeDisplayed();

    });

    it('deve exibir o botão voltar', async () => {

        const voltar = await $('~campanha-detalhe-botao-voltar');

        await expect(voltar).toBeDisplayed();

    });

});