const { abrirPerfil } = require('./helpers/navigation');

describe('Tela Perfil', () => {

    beforeEach(async () => {
        await abrirPerfil();
    });

    it('deve exibir a tela de perfil', async () => {
        await expect(await $('~tela-perfil')).toBeDisplayed();
    });

    it('deve exibir dados principais do usuário', async () => {
        await expect(await $('~perfil-titulo')).toBeDisplayed();
        await expect(await $('~perfil-nome')).toBeDisplayed();
        await expect(await $('~perfil-email')).toBeDisplayed();
    });

    it('deve exibir botão sair', async () => {
        await expect(await $('~perfil-botao-sair')).toBeDisplayed();
    });

});