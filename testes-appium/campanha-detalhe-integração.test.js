describe('Tela de Detalhe da Campanha', () => {

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

    before(async () => {
        await $('~inicio-botao-entrar').click();

        const telaLogin = await $('~tela-login');
        await telaLogin.waitForDisplayed({ timeout: 15000 });

        await $('~login-input-email').setValue(EMAIL);
        await $('~login-input-senha').setValue(SENHA);
        await $('~login-botao-entrar').click();

        const telaMenu = await $('~tela-menu');
        await telaMenu.waitForDisplayed({ timeout: 20000 });

        const botaoCampanhas = await $('~menu-botao-campanhas');
        await botaoCampanhas.waitForDisplayed({ timeout: 15000 });
        await botaoCampanhas.click();

        const tituloCampanhas = await $('android=new UiSelector().text("Campanhas")');
        await tituloCampanhas.waitForDisplayed({ timeout: 50000 });

        const campanhas = await $$(
            'android=new UiSelector().descriptionStartsWith("campanhas-item-")'
        );

        expect(campanhas.length).toBeGreaterThan(0);

        await campanhas[0].waitForDisplayed({ timeout: 15000 });
        await campanhas[0].click();

        const tituloDetalhe = await $('~campanha-detalhe-titulo');
        await tituloDetalhe.waitForDisplayed({ timeout: 20000 });
    });

    it('deve abrir a tela de detalhes da campanha', async () => {
        await expect(await $('~campanha-detalhe-titulo')).toBeDisplayed();
    });

    it('deve exibir o título da campanha', async () => {
        const titulo = await $('~campanha-detalhe-titulo');
        await expect(titulo).toBeDisplayed();
    });

    it('deve exibir a descrição da campanha', async () => {
        const descricao = await $('~campanha-descricao');
        await expect(descricao).toBeDisplayed();
    });

    it('deve exibir horário da campanha', async () => {
        await scrollParaBaixo();

        const source = await browser.getPageSource();

        expect(
            source.includes('campanha-horario') ||
            source.includes('Horário da Campanha') ||
            source.includes('08:30') ||
            source.includes('09:30')
        ).toBe(true);
    });

    it('deve exibir período da campanha', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('campanha-periodo') ||
            source.includes('Período da Campanha')
        ).toBe(true);
    });

    it('deve exibir público-alvo da campanha', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('campanha-publico-alvo') ||
            source.includes('Público Alvo')
        ).toBe(true);
    });

    it('deve exibir unidade de saúde', async () => {
        await scrollParaBaixo();

        const source = await browser.getPageSource();

        expect(
            source.includes('campanha-unidade-saude') ||
            source.includes('Unidade de Saúde')
        ).toBe(true);
    });

    it('deve exibir endereço da campanha', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('campanha-endereco') ||
            source.includes('Endereço')
        ).toBe(true);
    });

    it('deve exibir o botão Traçar Rota no GPS', async () => {
        const source = await browser.getPageSource();

        expect(
            source.includes('campanha-detalhe-botao-gps') ||
            source.includes('Traçar Rota no GPS')
        ).toBe(true);
    });

    it('deve voltar para a tela Campanhas', async () => {
        await scrollParaTopo();
        await scrollParaTopo();

        try {
            const voltar = await $('~campanha-detalhe-botao-voltar');
            await voltar.waitForDisplayed({ timeout: 10000 });
            await voltar.click();
        } catch (error) {
            await driver.back();
        }

        const telaCampanhasDepoisVoltar = await $('android=new UiSelector().text("Campanhas")');
        await telaCampanhasDepoisVoltar.waitForDisplayed({ timeout: 15000 });

        await expect(telaCampanhasDepoisVoltar).toBeDisplayed();
    });

});