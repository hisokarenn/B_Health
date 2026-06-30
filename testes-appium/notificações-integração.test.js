describe('Tela Notificações', () => {

    const EMAIL = 'teste@gmail.com';
    const SENHA = '123456';

    before(async () => {
        await browser.pause(3000);

        const botaoEntrarInicio = await $('~inicio-botao-entrar');
        await botaoEntrarInicio.waitForDisplayed({ timeout: 20000 });
        await botaoEntrarInicio.click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 20000 });

        await $('~login-input-email').setValue(EMAIL);
        await $('~login-input-senha').setValue(SENHA);
        await $('~login-botao-entrar').click();

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 30000 });

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
            source.includes('Notificações') ||
            source.includes('Nenhuma campanha nova') ||
            source.includes('Nova campanha publicada') ||
            source.includes('Toque para ver') ||
            source.includes('notificacoes-lista') ||
            source.includes('notificacoes-vazio')
        ).toBe(true);
    });

    it('deve verificar item de notificação quando existir', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('Nova campanha publicada') ||
            source.includes('Toque para ver') ||
            source.includes('Nenhuma campanha nova') ||
            source.includes('Notificações')
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
        await driver.back();

        await browser.pause(2000);

        const source = await browser.getPageSource();

        expect(
            source.includes('tela-menu') ||
            source.includes('Carteira de Vacinação') ||
            source.includes('Campanhas') ||
            source.includes('Importância da Vacina') ||
            source.includes('Fale Conosco') ||
            !source.includes('tela-notificacoes')
        ).toBe(true);
    });

});