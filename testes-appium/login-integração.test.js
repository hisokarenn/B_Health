describe('Tela Login', () => {

    const abrirTelaLogin = async () => {
        const telaLoginExiste = await $('~tela-login').isExisting();

        if (telaLoginExiste) {
            return;
        }

        const botaoEntrarInicio = await $('~inicio-botao-entrar');
        await botaoEntrarInicio.waitForDisplayed({ timeout: 15000 });
        await botaoEntrarInicio.click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 15000 });
    };

    const fecharAlertaAndroid = async () => {
        try {
            const botaoOk = await $('android=new UiSelector().text("OK")');
            await botaoOk.waitForDisplayed({ timeout: 5000 });
            await botaoOk.click();
            await browser.pause(500);
        } catch (error) {
            // Não havia alerta aberto
        }
    };

    beforeEach(async () => {
        await abrirTelaLogin();
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

        await email.clearValue();
        await senha.clearValue();

        await email.setValue('teste@gmail.com');
        await senha.setValue('123456');

        await expect(email).toBeDisplayed();
        await expect(senha).toBeDisplayed();
    });

    it('deve mostrar e ocultar a senha', async () => {
        const senha = await $('~login-input-senha');
        const mostrarSenha = await $('~login-botao-mostrar-senha');

        await senha.clearValue();
        await senha.setValue('123456');

        await mostrarSenha.click();
        await browser.pause(500);

        await mostrarSenha.click();
        await browser.pause(500);

        await expect(senha).toBeDisplayed();
    });

    it('deve marcar lembrar-me', async () => {
        const lembrarMe = await $('~login-checkbox-lembrarme');

        await lembrarMe.click();

        await expect(lembrarMe).toBeDisplayed();
    });

    it('deve validar tentativa de login sem preencher campos', async () => {
        const email = await $('~login-input-email');
        const senha = await $('~login-input-senha');

        await email.clearValue();
        await senha.clearValue();

        const entrar = await $('~login-botao-entrar');
        await entrar.click();

        const mensagemAlerta = await $('android=new UiSelector().text("E-mail e senha são obrigatórios.")');
        await mensagemAlerta.waitForDisplayed({ timeout: 5000 });
        await expect(mensagemAlerta).toBeDisplayed();

        await fecharAlertaAndroid();

        await email.setValue('teste@gmail.com');
        await senha.setValue('123456');
    });

    it('deve validar esqueci senha sem preencher email', async () => {
        const email = await $('~login-input-email');
        await email.clearValue();

        const botaoEsqueciSenha = await $('~login-botao-esqueci-senha');
        await botaoEsqueciSenha.click();

        const mensagemAlerta = await $('android=new UiSelector().text("Digite seu e-mail para recuperar a senha.")');
        await mensagemAlerta.waitForDisplayed({ timeout: 5000 });
        await expect(mensagemAlerta).toBeDisplayed();

        await fecharAlertaAndroid();
    });

    it('deve validar esqueci senha com email preenchido', async () => {
        const email = await $('~login-input-email');

        await email.clearValue();
        await email.setValue('teste@gmail.com');

        const botaoEsqueciSenha = await $('~login-botao-esqueci-senha');
        await botaoEsqueciSenha.click();
        await browser.pause(2000);

        await fecharAlertaAndroid();

        await expect(email).toBeDisplayed();
    });

    it('deve realizar login e entrar no menu do aplicativo', async () => {
        const email = await $('~login-input-email');
        const senha = await $('~login-input-senha');

        await email.clearValue();
        await senha.clearValue();

        await email.setValue('teste@gmail.com');
        await senha.setValue('123456');

        const entrar = await $('~login-botao-entrar');
        await entrar.click();

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 20000 });

        await expect(telaMenu).toBeDisplayed();
    });
    });