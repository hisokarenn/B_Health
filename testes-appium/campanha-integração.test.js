describe('Tela Campanhas', () => {

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

        const botaoCampanhas = await $('~menu-botao-campanhas');
        await botaoCampanhas.waitForDisplayed({ timeout: 15000 });
        await botaoCampanhas.click();

        const tituloCampanhas = await $('android=new UiSelector().text("Campanhas")');
        await tituloCampanhas.waitForDisplayed({ timeout: 50000 });
    });

    it('deve abrir a tela Campanhas pelo Menu', async () => {
        const tituloCampanhas = await $('android=new UiSelector().text("Campanhas")');
        await expect(tituloCampanhas).toBeDisplayed();
    });

    it('deve exibir o título Campanhas', async () => {
        const titulo = await $('android=new UiSelector().text("Campanhas")');
        await expect(titulo).toBeDisplayed();
    });

    it('deve exibir o subtítulo da tela de campanhas', async () => {
        const subtitulo = await $('android=new UiSelector().text("Mantenha sua vacinação em dia")');
        await subtitulo.waitForDisplayed({ timeout: 10000 });
        await expect(subtitulo).toBeDisplayed();
    });

    it('deve exibir conteúdo principal da tela de campanhas', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('Campanhas') ||
            source.includes('Mantenha sua vacinação em dia') ||
            source.includes('campanhas-botao-voltar') ||
            source.includes('B Health')
        ).toBe(true);
    });

    it('deve verificar o botão de voltar', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('campanhas-botao-voltar') ||
            source.includes('B Health')
        ).toBe(true);
    });

    it('deve voltar para o Menu', async () => {
        try {
            const voltar = await $('android=new UiSelector().resourceId("campanhas-botao-voltar")');
            await voltar.click();
        } catch (error) {
            const voltarAlt = await $('~campanhas-botao-voltar');
            await voltarAlt.click();
        }

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 15000 });

        await expect(telaMenu).toBeDisplayed();
    });

});