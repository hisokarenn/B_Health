describe('Tela Login', () => {

    beforeEach(async () => {
        const botaoEntrarInicio = await $('~inicio-botao-entrar');

        if (await botaoEntrarInicio.isDisplayed()) {
            await botaoEntrarInicio.click();
        }

        const telaLogin = await $('~tela-login');

        await telaLogin.waitForDisplayed({
            timeout: 10000
        });
    });

    it('deve exibir a tela login', async () => {
        const telaLogin = await $('~tela-login');
        await expect(telaLogin).toBeDisplayed();
    });

    it('deve exibir campo email', async () => {
        const email = await $('~login-input-email');
        await expect(email).toBeDisplayed();
    });

    it('deve exibir campo senha', async () => {
        const senha = await $('~login-input-senha');
        await expect(senha).toBeDisplayed();
    });

    it('deve exibir botão entrar', async () => {
        const entrar = await $('~login-botao-entrar');
        await expect(entrar).toBeDisplayed();
    });

    it('deve preencher email e senha sem enviar login', async () => {
        const email = await $('~login-input-email');
        const senha = await $('~login-input-senha');

        await email.setValue('teste@email.com');
        await senha.setValue('123456');

        await expect(email).toHaveText('teste@email.com');
    });

    it('deve mostrar e ocultar a senha', async () => {
        const senha = await $('~login-input-senha');
        const mostrarSenha = await $('~login-botao-mostrar-senha');

        await senha.setValue('123456');
        await mostrarSenha.click();
        await browser.pause(500);
        await mostrarSenha.click();

        await expect(senha).toBeDisplayed();
    });

    it('deve marcar lembrar-me', async () => {
        const lembrarMe = await $('~login-checkbox-lembrarme');

        await lembrarMe.click();

        await expect(lembrarMe).toBeDisplayed();
    });

    it('deve validar tentativa de login sem preencher campos', async () => {
        const entrar = await $('~login-botao-entrar');

        await entrar.click();

        const erro = await $('~login-mensagem-erro');

        await erro.waitForDisplayed({ timeout: 5000 });

        await expect(erro).toBeDisplayed();
    });
});