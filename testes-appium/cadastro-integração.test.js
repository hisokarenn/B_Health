const { abrirCadastro } = require('./helpers/navigation');

describe('Tela Cadastro', () => {

    beforeEach(async () => {
        await abrirCadastro();
    });

    it('deve exibir a tela de cadastro', async () => {
        const telaCadastro = await $('~tela-cadastro');

        await expect(telaCadastro).toBeDisplayed();
    });

    it('deve exibir os campos principais', async () => {
        await expect(await $('~cadastro-input-nome')).toBeDisplayed();
        await expect(await $('~cadastro-input-cpf')).toBeDisplayed();
        await expect(await $('~cadastro-input-cns')).toBeDisplayed();
        await expect(await $('~cadastro-input-email')).toBeDisplayed();
        await expect(await $('~cadastro-input-senha')).toBeDisplayed();
    });

    it('deve preencher os campos do cadastro sem submeter', async () => {
        await $('~cadastro-input-nome').setValue('Paciente Teste');
        await $('~cadastro-input-cpf').setValue('12345678901');
        await $('~cadastro-input-cns').setValue('123456789012345');
        await $('~cadastro-input-email').setValue('paciente.teste@gmail.com');
        await $('~cadastro-input-senha').setValue('123456');

        await expect(await $('~cadastro-input-email')).toBeDisplayed();
    });

    it('deve mostrar e ocultar senha no cadastro', async () => {
        const senha = await $('~cadastro-input-senha');
        const mostrarSenha = await $('~cadastro-botao-mostrar-senha');

        await senha.setValue('123456');
        await mostrarSenha.click();
        await browser.pause(500);
        await mostrarSenha.click();

        await expect(senha).toBeDisplayed();
    });

    it('deve voltar para login', async () => {
        const voltarLogin = await $('~cadastro-botao-voltar-login');

        await voltarLogin.click();

        const telaLogin = await $('~tela-login');

        await telaLogin.waitForDisplayed({ timeout: 10000 });

        await expect(telaLogin).toBeDisplayed();
    });

});