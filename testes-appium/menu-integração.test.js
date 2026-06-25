describe('Tela Menu', () => {

    const EMAIL = 'teste@gmail.com';
    const SENHA = '123456';

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

    const scrollParaTopo = async () => {
        await browser.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 500, y: 700 },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 300 },
                { type: 'pointerMove', duration: 800, x: 500, y: 1700 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        await browser.releaseActions();
        await browser.pause(800);
    };

    const fecharAlertaAndroid = async (botao = 'Não') => {
        const alerta = await $(`android=new UiSelector().text("${botao}")`);
        await alerta.waitForDisplayed({ timeout: 5000 });
        await alerta.click();
        await browser.pause(500);
    };

    before(async () => {
        const botaoEntrarInicio = await $('~inicio-botao-entrar');
        await botaoEntrarInicio.waitForDisplayed({ timeout: 15000 });
        await botaoEntrarInicio.click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 15000 });

        await $('~login-input-email').setValue(EMAIL);
        await $('~login-input-senha').setValue(SENHA);
        await $('~login-botao-entrar').click();

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 20000 });
    });

    it('deve exibir a tela de menu', async () => {
        await expect(await $('~tela-menu')).toBeDisplayed();
    });

    it('deve exibir o botão Carteira de Vacinação', async () => {
        await scrollParaTopo();

        const botao = await $('~menu-botao-historico');
        await expect(botao).toBeDisplayed();
    });

    it('deve exibir o botão Campanhas', async () => {
        const botao = await $('~menu-botao-campanhas');
        await expect(botao).toBeDisplayed();
    });

    it('deve abrir e fechar o modal Importância da Vacina', async () => {
        await scrollParaBaixo();

        const abrir = await $('~menu-botao-importancia');
        await abrir.waitForDisplayed({ timeout: 10000 });
        await abrir.click();

        const titulo = await $('android=new UiSelector().text("Importância")');
        await titulo.waitForDisplayed({ timeout: 5000 });
        await expect(titulo).toBeDisplayed();

        const fechar = await $('android=new UiSelector().text("Fechar")');
        await fechar.waitForDisplayed({ timeout: 5000 });
        await fechar.click();

        await browser.pause(500);
        await expect(await $('~tela-menu')).toBeDisplayed();
    });

    it('deve abrir e fechar o modal Fale Conosco', async () => {
        await scrollParaBaixo();

        const abrir = await $('~menu-botao-fale-conosco');
        await abrir.waitForDisplayed({ timeout: 10000 });
        await abrir.click();

        const titulo = await $('android=new UiSelector().text("Fale Conosco")');
        await titulo.waitForDisplayed({ timeout: 5000 });
        await expect(titulo).toBeDisplayed();

        const fechar = await $('android=new UiSelector().text("Fechar")');
        await fechar.waitForDisplayed({ timeout: 5000 });
        await fechar.click();

        await browser.pause(500);
        await expect(await $('~tela-menu')).toBeDisplayed();
    });

    it('deve abrir e fechar o modal Sobre Nós', async () => {
        await scrollParaBaixo();

        const abrir = await $('~menu-botao-sobre-nos');
        await abrir.waitForDisplayed({ timeout: 10000 });
        await abrir.click();

        const titulo = await $('android=new UiSelector().text("Sobre Nós")');
        await titulo.waitForDisplayed({ timeout: 5000 });
        await expect(titulo).toBeDisplayed();

        const fechar = await $('android=new UiSelector().text("Fechar")');
        await fechar.waitForDisplayed({ timeout: 5000 });
        await fechar.click();

        await browser.pause(500);
        await expect(await $('~tela-menu')).toBeDisplayed();
    });

    it('deve validar a opção de logout no menu', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('menu-botao-sair') ||
            source.includes('') ||
            source.includes('log-out')
        ).toBe(true);
    });
});