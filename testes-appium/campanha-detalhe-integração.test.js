const {
    abrirDetalheCampanha
} = require('./helpers/navigation');

describe('Tela de Detalhe da Campanha', () => {

    beforeEach(async () => {
        await abrirDetalheCampanha();
    });

    it('deve exibir a tela de detalhe', async () => {
        await expect(await $('~tela-campanha-detalhe')).toBeDisplayed();
    });

    it('deve exibir informações principais da campanha', async () => {
        await expect(await $('~campanha-detalhe-titulo')).toBeDisplayed();
        await expect(await $('~campanha-descricao')).toBeDisplayed();
        await expect(await $('~campanha-horario')).toBeDisplayed();
        await expect(await $('~campanha-periodo')).toBeDisplayed();
        await expect(await $('~campanha-publico-alvo')).toBeDisplayed();
        await expect(await $('~campanha-unidade-saude')).toBeDisplayed();
        await expect(await $('~campanha-endereco')).toBeDisplayed();
    });

    it('deve exibir o botão GPS', async () => {
        const gps = await $('~campanha-detalhe-botao-gps');

        await expect(gps).toBeDisplayed();
    });

    it('deve voltar para campanhas', async () => {
        const voltar = await $('~campanha-detalhe-botao-voltar');

        await voltar.click();

        const telaCampanhas = await $('~tela-campanhas');

        await telaCampanhas.waitForDisplayed({ timeout: 10000 });

        await expect(telaCampanhas).toBeDisplayed();
    });

});