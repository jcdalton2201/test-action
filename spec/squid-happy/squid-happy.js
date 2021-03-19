
const difUtil = require('../diff-util.js');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const AxeUtil = require('../axe-util.js');
describe('Unit and Functional Tests for squid-happy',()=>{
    let browser = null;
    let page = null;
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
    });
    afterEach(async () => {
        const bodyhandle = await page.$('body');
        await page.evaluate(element => {
            element.innerHTML = '';
        }, bodyhandle);

    });
    afterAll(async () => { })
    it('Test the accessibility of happy',async()=>{
        browser = await difUtil.setTestName(
            'Test the accessibility of happy'
        );
        page = await difUtil.createPage(browser);
        const bodyhandle = await difUtil.createBodyHandle(page);
        await page.evaluate(element => {
            element.innerHTML =
                `<squid-happy >
                Test
                </squid-happy>`;
        }, bodyhandle);
        await page.waitForSelector('squid-happy');
        const results = await new AxePuppeteer(page).include('squid-happy').analyze();
        expect(AxeUtil.isValid(results)).toBeTruthy();
  });
});
