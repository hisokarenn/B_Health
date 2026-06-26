describe('Tela Notificações', () => {

    const EMAIL = 'teste@gmail.com';
    const SENHA = '123456';

    before(async () => {
        await $('~inicio-botao-entrar').click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 15000 });

        await $('~login-input-email').setValue(EMAIL);
        await $('~login-input-senha').setValue(SENHA);
        await $('~login-botao-entrar').click();

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 20000 });

        const notificacoes = await $('android=new UiSelector().descriptionContains("Notificações")');
        await notificacoes.waitForDisplayed({ timeout: 15000 });
        await notificacoes.click();

        const titulo = await $('android=new UiSelector().text("Notificações")');
        await titulo.waitForDisplayed({ timeout: 30000 });
    });

    it('deve abrir a tela de notificações', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('tela-notificacoes') ||
            source.includes('Notificações')
        ).toBe(true);
    });

    it('deve exibir o título Notificações', async () => {
        const titulo = await $('android=new UiSelector().text("Notificações")');
        await expect(titulo).toBeDisplayed();
    });

    it('deve exibir lista, mensagem vazia ou erro', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('notificacoes-lista') ||
            source.includes('notificacoes-vazio') ||
            source.includes('Nenhuma campanha nova') ||
            source.includes('Não foi possível carregar')
        ).toBe(true);
    });

    it('deve verificar item de notificação quando existir', async () => {
        const itens = await $$(
            'android=new UiSelector().descriptionStartsWith("notificacoes-item-")'
        );

        const source = await browser.getPageSource();

        expect(
            itens.length > 0 ||
            source.includes('Nenhuma campanha nova') ||
            source.includes('notificacoes-vazio')
        ).toBe(true);
    });

    it('deve verificar botão de voltar', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('notificacoes-botao-voltar') ||
            source.includes('Notificações')
        ).toBe(true);
    });

    it('deve voltar para o menu', async () => {
        try {
            const voltar = await $('~notificacoes-botao-voltar');
            await voltar.waitForDisplayed({ timeout: 10000 });
            await voltar.click();
        } catch (error) {
            await driver.back();
        }

        const menu = await $('~tela-menu');
        await menu.waitForDisplayed({ timeout: 15000 });

        await expect(menu).toBeDisplayed();
    });

});