const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

// Create a browser instance
let browser = false;

app.get('/', (req, res) => {
    res.send('Pauku Project');
});

app.get('/:id', async (req, res) => {
    try {

        browser = !browser ? await puppeteer.launch() : browser;

        const page = await browser.newPage();

        await page.setViewport({
            width: 1280,
            height: 720
        });

        const url = 'https://racaty.io/' + req.params.id;

        page.on('request', req => {
            console.log(req.headers());
        });

        page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36"
        );

        await page.goto(url, {
            waitUntil: 'networkidle0'
        });


        await page.waitForSelector('#downloadbtn .after', {
            visible: true,
        });

        await Promise.all([
            page.$eval('#downloadbtn', form => form.click()),
            page.waitForNavigation({
                waitUntil: 'networkidle2'
            })
        ]);

        const data = await page.evaluate(() => document.querySelector('a#uniqueExpirylink').href);

        await page.close();

        res.send(data);

    } catch (error) {
        res.send(error);
    }
})

app.listen(3000);