async function fazerLogin() {

    const telaLogin = await $('~tela-login');

    if (!(await telaLogin.isDisplayed())) {

        const entrarInicio = await $('~inicio-botao-entrar');

        await entrarInicio.click();

        await telaLogin.waitForDisplayed({
            timeout: 10000
        });
    }

    const email = await $('~login-input-email');

    await email.setValue('SEU_EMAIL_TESTE');

    const senha = await $('~login-input-senha');

    await senha.setValue('SUA_SENHA_TESTE');

    const entrar = await $('~login-botao-entrar');

    await entrar.click();

    await $('~menu-botao-campanhas').waitForDisplayed({
        timeout: 20000
    });
}

async function abrirCampanhas() {

    await fazerLogin();

    const campanhas = await $('~menu-botao-campanhas');

    await campanhas.click();

    await browser.pause(5000);
}

async function abrirDetalheCampanha() {

    await abrirCampanhas();

    const itens = await $$(
        'android=new UiSelector().descriptionContains("campanhas-item-")'
    );

    if (itens.length === 0) {
        throw new Error('Nenhuma campanha foi carregada.');
    }

    await itens[0].click();

    await $('~campanha-detalhe-titulo').waitForDisplayed({
        timeout: 15000
    });
}

module.exports = {
    fazerLogin,
    abrirCampanhas,
    abrirDetalheCampanha
};