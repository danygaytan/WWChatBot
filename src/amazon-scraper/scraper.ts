import puppeteer from 'puppeteer';

export const searchProduct = async (product_label: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://amazon.com.mx');
    await page.setViewport({width: 1080, height: 1024});

    const searchBox = await page.$('#twotabsearchtextbox');

    console.log(await searchBox?.evaluate(el => el.textContent));
}
