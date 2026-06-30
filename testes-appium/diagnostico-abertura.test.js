describe('Diagnóstico de abertura', () => {
    it('deve mostrar a tela atual do app', async () => {
        await browser.pause(5000);

        const source = await browser.getPageSource();

        console.log(source);
    });
});
