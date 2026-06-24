async function irParaLogin() {
    const telaLogin = await $('~tela-login');

    if (await telaLogin.isDisplayed()) {
        return;
    }

    const botaoInicio = await $('~inicio-botao-entrar');

    await botaoInicio.waitForDisplayed({
        timeout: 10000
    });

    await botaoInicio.click();

    await telaLogin.waitForDisplayed({
        timeout: 10000
    });
}

async function fazerLogin() {
    const telaMenu = await $('~tela-menu');

    if (await telaMenu.isDisplayed()) {
        return;
    }

    await irParaLogin();

    const email = await $('~login-input-email');
    const senha = await $('~login-input-senha');
    const entrar = await $('~login-botao-entrar');

    await email.clearValue();
    await senha.clearValue();

    await email.setValue('teste@gmail.com');
    await senha.setValue('123456');

    await entrar.click();

    await telaMenu.waitForDisplayed({
        timeout: 20000
    });
}

async function abrirCampanhas() {
    await fazerLogin();

    const campanhas = await $('~menu-botao-campanhas');

    await campanhas.waitForDisplayed({
        timeout: 10000
    });

    await campanhas.click();

    const telaCampanhas = await $('~tela-campanhas');

    await telaCampanhas.waitForDisplayed({
        timeout: 30000
    });
}

async function abrirHistorico() {
    await fazerLogin();

    const historico = await $('~menu-botao-historico');

    await historico.waitForDisplayed({
        timeout: 10000
    });

    await historico.click();

    const telaHistorico = await $('~tela-historico');

    await telaHistorico.waitForDisplayed({
        timeout: 30000
    });
}

async function abrirCadastro() {
    await irParaLogin();

    const botaoCadastro = await $('~login-botao-cadastro');

    await botaoCadastro.waitForDisplayed({
        timeout: 10000
    });

    await botaoCadastro.click();

    const telaCadastro = await $('~tela-cadastro');

    await telaCadastro.waitForDisplayed({
        timeout: 10000
    });
}

async function abrirDetalheCampanha() {
    await abrirCampanhas();

    const primeiraCampanha = await $('~campanhas-item-0');

    await primeiraCampanha.waitForDisplayed({
        timeout: 30000
    });

    await primeiraCampanha.click();

    const telaDetalhe = await $('~tela-campanha-detalhe');

    await telaDetalhe.waitForDisplayed({
        timeout: 15000
    });
}

async function abrirNotificacoes() {
    await fazerLogin();

    const notificacoes = await $('~nav-notificacoes');

    await notificacoes.waitForDisplayed({
        timeout: 10000
    });

    await notificacoes.click();

    const telaNotificacoes = await $('~tela-notificacoes');

    await telaNotificacoes.waitForDisplayed({
        timeout: 30000
    });
}

async function abrirPerfil() {
    await fazerLogin();

    const perfil = await $('~nav-perfil');

    await perfil.waitForDisplayed({
        timeout: 10000
    });

    await perfil.click();

    const telaPerfil = await $('~tela-perfil');

    await telaPerfil.waitForDisplayed({
        timeout: 30000
    });
}

module.exports = {
    irParaLogin,
    fazerLogin,
    abrirCampanhas,
    abrirHistorico,
    abrirCadastro,
    abrirDetalheCampanha,
    abrirNotificacoes,
    abrirPerfil
};