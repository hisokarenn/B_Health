const { abrirNotificacoes } = require('./helpers/navigation');

describe('Tela Notificações', () => {

    beforeEach(async () => {
        await abrirNotificacoes();
    });

    it('deve exibir a tela de notificações', async () => {
        await expect(await $('~tela-notificacoes')).toBeDisplayed();
    });

    it('deve exibir lista ou mensagem vazia', async () => {
        const lista = await $('~notificacoes-lista');
        const vazio = await $('~notificacoes-vazio');

        const listaExiste = await lista.isExisting();
        const vazioExiste = await vazio.isExisting();

        expect(listaExiste || vazioExiste).toBe(true);
    });

    it('deve voltar para o menu', async () => {
        await $('~notificacoes-botao-voltar').click();

        const menu = await $('~tela-menu');
        await menu.waitForDisplayed({ timeout: 10000 });

        await expect(menu).toBeDisplayed();
    });

});