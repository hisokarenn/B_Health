describe('Tela Login', () => {

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

});