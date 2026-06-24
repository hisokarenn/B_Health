const { realizarLoginTeste } = require('./helpers/navigation');

describe('Tela Menu', () => {

    beforeEach(async () => {
        await realizarLoginTeste();
    });

    it('deve exibir a tela de menu', async () => {
        const telaMenu = await $('~tela-menu');

        await telaMenu.waitForDisplayed({ timeout: 15000 });

        await expect(telaMenu).toBeDisplayed();
    });

    it('deve abrir e fechar modal Importância da Vacina', async () => {
        await $('~menu-botao-importancia').click();

        const titulo = await $('~menu-modal-importancia-titulo');

        await titulo.waitForDisplayed({ timeout: 5000 });

        await expect(titulo).toBeDisplayed();

        await $('~menu-modal-importante-fechar').click();
    });

    it('deve abrir e fechar modal Fale Conosco', async () => {
        await $('~menu-botao-fale-conosco').click();

        const titulo = await $('~menu-modal-fale-conosco-titulo');

        await titulo.waitForDisplayed({ timeout: 5000 });

        await expect(titulo).toBeDisplayed();

        await $('~menu-modal-fale-conosco-fechar').click();
    });

    it('deve abrir e fechar modal Sobre Nós', async () => {
        await $('~menu-botao-sobre-nos').click();

        const titulo = await $('~menu-modal-sobre-nos-titulo');

        await titulo.waitForDisplayed({ timeout: 5000 });

        await expect(titulo).toBeDisplayed();

        await $('~menu-modal-sobre-nos-fechar').click();
    });

    it('deve navegar para histórico', async () => {
        await $('~menu-botao-historico').click();

        const telaHistorico = await $('~tela-historico');

        await telaHistorico.waitForDisplayed({ timeout: 15000 });

        await expect(telaHistorico).toBeDisplayed();
    });

    it('deve navegar para campanhas', async () => {
        await $('~menu-botao-campanhas').click();

        const telaCampanhas = await $('~tela-campanhas');

        await telaCampanhas.waitForDisplayed({ timeout: 20000 });

        await expect(telaCampanhas).toBeDisplayed();
    });

});