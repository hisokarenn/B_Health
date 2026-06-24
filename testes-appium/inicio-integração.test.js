describe('Inicialização do Aplicativo', () => {

    it('deve abrir o aplicativo', async () => {

        const telaInicio = await $('~tela-inicio');

        await expect(telaInicio).toBeDisplayed();

    });

});

describe('Tela Inicial', () => {

    it('deve exibir a tela inicial', async () => {

        const telaInicio = await $('~tela-inicio');

        await expect(telaInicio).toBeDisplayed();

    });

    it('deve exibir o logo', async () => {

        const logo = await $('~inicio-logo-texto');

        await expect(logo).toBeDisplayed();

    });

    it('deve exibir o botão entrar', async () => {

        const botaoEntrar = await $('~inicio-botao-entrar');

        await expect(botaoEntrar).toBeDisplayed();

    });

    it('deve navegar para login', async () => {

        const botaoEntrar = await $('~inicio-botao-entrar');

        await botaoEntrar.click();

        const telaLogin = await $('~tela-login');

        await telaLogin.waitForDisplayed({
            timeout: 10000
        });

        await expect(telaLogin).toBeDisplayed();

    });

});