describe('Tela Cadastro', () => {

    const byId = (id) => $(`android=new UiSelector().resourceId("${id}")`);

    const fecharAlertaAndroid = async () => {
        const ok = await $('android=new UiSelector().text("OK")');
        await ok.waitForDisplayed({ timeout: 5000 });
        await ok.click();
        await browser.pause(500);
    };

    const scrollParaBaixo = async () => {
        await browser.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 500, y: 1700 },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 300 },
                { type: 'pointerMove', duration: 800, x: 500, y: 700 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await browser.releaseActions();
        await browser.pause(800);
    };

    it('deve abrir a tela de cadastro', async () => {
        await $('~inicio-botao-entrar').click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 15000 });

        const botaoCadastro = await $('~login-botao-cadastro');
        await botaoCadastro.click();

        const tituloCadastro = await $('android=new UiSelector().text("Cadastro")');
        await tituloCadastro.waitForDisplayed({ timeout: 15000 });

        await expect(tituloCadastro).toBeDisplayed();
    });

    it('deve testar o campo Nome Completo', async () => {
        const nome = await byId('cadastro-input-nome');
        await nome.setValue('Paciente Teste');
        await expect(nome).toBeDisplayed();
    });

    it('deve testar o campo CPF', async () => {
        const cpf = await byId('cadastro-input-cpf');
        await cpf.setValue('12345678901');
        await expect(cpf).toBeDisplayed();
    });

    it('deve testar o campo CNS', async () => {
        const cns = await byId('cadastro-input-cns');
        await cns.setValue('123456789012345');
        await expect(cns).toBeDisplayed();
    });

    it('deve testar o campo E-mail', async () => {
        await scrollParaBaixo();

        const email = await byId('cadastro-input-email');
        await email.setValue('paciente.teste@gmail.com');
        await expect(email).toBeDisplayed();
    });

    it('deve testar o campo Senha', async () => {
        const senha = await byId('cadastro-input-senha');
        await senha.setValue('123456');
        await expect(senha).toBeDisplayed();
    });

    it('deve testar o campo de senha protegida', async () => {
        const senha = await byId('cadastro-input-senha');

        await expect(senha).toBeDisplayed();
    });

    it('deve testar o botão Cadastrar com campos preenchidos', async () => {
        const cadastrar = await byId('cadastro-botao-submeter');
        await expect(cadastrar).toBeDisplayed();
    });

    it('deve validar cadastro com campos vazios', async () => {
        const email = await byId('cadastro-input-email');
        const senha = await byId('cadastro-input-senha');

        await email.clearValue();
        await senha.clearValue();

        const cadastrar = await byId('cadastro-botao-submeter');
        await cadastrar.click();

        const alerta = await $('android=new UiSelector().text("Todos os campos são obrigatórios")');
        await alerta.waitForDisplayed({ timeout: 5000 });
        await expect(alerta).toBeDisplayed();

        await fecharAlertaAndroid();
    });

    it('deve validar e-mail inválido', async () => {
        const email = await byId('cadastro-input-email');
        const senha = await byId('cadastro-input-senha');

        await email.setValue('paciente.teste@hotmail.com');
        await senha.setValue('123456');

        const cadastrar = await byId('cadastro-botao-submeter');
        await cadastrar.click();

        const alerta = await $('android=new UiSelector().text("Use um e-mail válido do domínio @gmail.com.")');
        await alerta.waitForDisplayed({ timeout: 5000 });
        await expect(alerta).toBeDisplayed();

        await fecharAlertaAndroid();
    });

    it('deve voltar para Login', async () => {
        const voltarLogin = await byId('cadastro-botao-voltar-login');
        await voltarLogin.click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 10000 });

        await expect(telaLogin).toBeDisplayed();
    });

});