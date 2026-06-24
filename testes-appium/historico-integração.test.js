const { realizarLoginTeste } = require('./helpers/navigation');

describe('Tela Histórico', () => {

    beforeEach(async () => {
        await realizarLoginTeste();

        const botaoHistorico = await $('~menu-botao-historico');

        await botaoHistorico.waitForDisplayed({ timeout: 15000 });

        await botaoHistorico.click();

        const telaHistorico = await $('~tela-historico');

        await telaHistorico.waitForDisplayed({ timeout: 30000 });
    });

    it('deve exibir a tela histórico', async () => {
        await expect(await $('~tela-historico')).toBeDisplayed();
    });

    it('deve exibir a lista ou mensagem vazia', async () => {
        const lista = await $('~historico-lista');
        const vazia = await $('~historico-lista-vazia');

        const listaExiste = await lista.isExisting();
        const vaziaExiste = await vazia.isExisting();

        expect(listaExiste || vaziaExiste).toBe(true);
    });

    it('deve voltar para o menu', async () => {
        await $('~historico-botao-voltar').click();

        const menu = await $('~tela-menu');

        await menu.waitForDisplayed({ timeout: 10000 });

        await expect(menu).toBeDisplayed();
    });

});