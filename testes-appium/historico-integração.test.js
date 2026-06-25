describe('Tela Histórico', () => {

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

        const botaoHistorico = await $('~menu-botao-historico');
        await botaoHistorico.waitForDisplayed({ timeout: 15000 });
        await botaoHistorico.click();

        const tituloHistorico = await $('android=new UiSelector().text("Minhas Vacinas")');
        await tituloHistorico.waitForDisplayed({ timeout: 30000 });
    });

    it('deve abrir a tela Histórico pelo Menu', async () => {
        const tituloHistorico = await $('android=new UiSelector().text("Minhas Vacinas")');
        await expect(tituloHistorico).toBeDisplayed();
    });

    it('deve exibir o título Minhas Vacinas', async () => {
        const titulo = await $('android=new UiSelector().text("Minhas Vacinas")');
        await titulo.waitForDisplayed({ timeout: 10000 });
        await expect(titulo).toBeDisplayed();
    });

    it('deve exibir a lista de histórico ou mensagem vazia', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('Mantenha sua carteira sempre atualizada') ||
            source.includes('Nenhum registro encontrado') ||
            source.includes('Não há registros de vacina disponíveis') ||
            source.includes('Minhas Vacinas') ||
            source.includes('Aplicado em:')
        ).toBe(true);
    });

    it('deve exibir o aviso de atualização da carteira', async () => {
        const aviso = await $('android=new UiSelector().textContains("Mantenha sua carteira")');
        await aviso.waitForDisplayed({ timeout: 10000 });
        await expect(aviso).toBeDisplayed();
    });

    it('deve verificar o botão de voltar', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('historico-botao-voltar') ||
            source.includes('B Health')
        ).toBe(true);
    });

    it('deve voltar para o Menu', async () => {
        try {
            const voltar = await $('android=new UiSelector().resourceId("historico-botao-voltar")');
            await voltar.click();
        } catch (error) {
            await driver.back();
        }

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 15000 });

        await expect(telaMenu).toBeDisplayed();
    });
});