describe('Tela Perfil', () => {

    const EMAIL = 'teste@gmail.com';
    const SENHA = '123456';

    const scrollParaBaixo = async () => {
        await browser.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 500, y: 1800 },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 300 },
                { type: 'pointerMove', duration: 900, x: 500, y: 300 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        await browser.releaseActions();
        await browser.pause(1000);
    };

    const fecharAlertaAndroid = async () => {
        const cancelar = await $('android=new UiSelector().text("CANCELAR")');

        await cancelar.waitForDisplayed({ timeout: 10000 });
        await cancelar.click();

        await browser.pause(500);
    };  

    before(async () => {
        await $('~inicio-botao-entrar').click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 15000 });

        await $('~login-input-email').setValue(EMAIL);
        await $('~login-input-senha').setValue(SENHA);
        await $('~login-botao-entrar').click();

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 20000 });

        const perfil = await $('android=new UiSelector().descriptionContains("Perfil")');
        await perfil.waitForDisplayed({ timeout: 15000 });
        await perfil.click();

        const tituloPerfil = await $('android=new UiSelector().text("Meu Perfil")');
        await tituloPerfil.waitForDisplayed({ timeout: 30000 });
    });

    it('deve abrir a tela Perfil', async () => {
        const titulo = await $('android=new UiSelector().text("Meu Perfil")');
        await expect(titulo).toBeDisplayed();
    });

    it('deve exibir o título Meu Perfil', async () => {
        const titulo = await $('android=new UiSelector().text("Meu Perfil")');
        await expect(titulo).toBeDisplayed();
    });

    it('deve exibir nome do usuário', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('perfil-nome') ||
            source.includes('Usuário') ||
            source.includes('Teste')
        ).toBe(true);
    });

    it('deve exibir e-mail do usuário', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('perfil-email') ||
            source.includes('@') ||
            source.includes(EMAIL)
        ).toBe(true);
    });

    it('deve exibir CPF e CNS', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('CPF') &&
            source.includes('Cartão Nacional de Saúde')
        ).toBe(true);
    });

    it('deve exibir status da conta', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('Status da Conta') ||
            source.includes('Ativa / Verificada')
        ).toBe(true);
    });

    it('deve exibir botão Sair da Conta', async () => {
        await scrollParaBaixo();
        await scrollParaBaixo();

        const source = await browser.getPageSource();

        expect(
            source.includes('perfil-botao-sair') ||
            source.includes('Sair da Conta')
        ).toBe(true);
    });

    it('deve abrir alerta de logout e cancelar saída', async () => {
        await scrollParaBaixo();
        await scrollParaBaixo();

        const sair = await $('android=new UiSelector().text("Sair da Conta")');
        await sair.waitForDisplayed({ timeout: 15000 });
        await sair.click();

        const alerta = await $('android=new UiSelector().text("Deseja realmente sair da sua conta?")');
        await alerta.waitForDisplayed({ timeout: 10000 });
        await expect(alerta).toBeDisplayed();

        await fecharAlertaAndroid();

        const source = await browser.getPageSource();

        expect(
            source.includes('Sair da Conta') ||
            source.includes('perfil-botao-sair') ||
            source.includes('B Health App')
        ).toBe(true);
    });

});