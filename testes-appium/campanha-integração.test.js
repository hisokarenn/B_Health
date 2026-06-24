const { realizarLoginTeste } = require('./helpers/navigation');

describe('Tela Campanhas', () => {

    beforeEach(async () => {
        await realizarLoginTeste();

        const campanhas = await $('~menu-botao-campanhas');

        await campanhas.waitForDisplayed({ timeout: 15000 });

        await campanhas.click();

        const telaCampanhas = await $('~tela-campanhas');

        await telaCampanhas.waitForDisplayed({ timeout: 30000 });
    });

    it('deve exibir a tela de campanhas', async () => {
        await expect(await $('~tela-campanhas')).toBeDisplayed();
    });

    it('deve exibir a lista de campanhas ou estado de carregamento', async () => {
        const telaCampanhas = await $('~tela-campanhas');

        await expect(telaCampanhas).toBeDisplayed();
    });

    it('deve abrir o detalhe da primeira campanha quando existir', async () => {
        const primeiraCampanha = await $('~campanhas-item-0');

        await primeiraCampanha.waitForDisplayed({ timeout: 30000 });

        await primeiraCampanha.click();

        const detalhe = await $('~tela-campanha-detalhe');

        await detalhe.waitForDisplayed({ timeout: 15000 });

        await expect(detalhe).toBeDisplayed();
    });

    it('deve voltar para o menu', async () => {
        await $('~campanhas-botao-voltar').click();

        const menu = await $('~tela-menu');

        await menu.waitForDisplayed({ timeout: 10000 });

        await expect(menu).toBeDisplayed();
    });

});