const puppeteer = require('puppeteer');
// const Differencify = require('differencify');
const coverageUtil = require('./coverage-util.js');
// const differencify = new Differencify({});
let browser = null;
let page = null;
jasmine.getEnv().addReporter({
    jasmineStarted: function(){
        console.log('running');
    },
    jasmineDone: async () => {
        const [jsCoverage] = await coverageUtil.stopCoverage(page);
        await coverageUtil.displayCoverage(jsCoverage,{include:['squid-core-ui.js']});
        page.close();
        browser.close();
    }
});

module.exports.setTestName = async function setTestName() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    if(!browser) {
        browser = await puppeteer.launch({ headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    }
    return browser;

};
module.exports.createPage = async function createPage(browser) {
    if(!page){
        // await browser.launch({ headless: true, product: 'chrome' });
        page =  await browser.newPage();
        coverageUtil.startCoverage(page);
    }
    return page;
    // await browser.launch({ headless: true, product: 'chrome' });
    // return await browser.newPage();
};
  
module.exports.createBodyHandle = async function createBodyHandle(page) {
    await page.setBypassCSP(true);
    await page.setViewport({ width: 1600, height: 1200 });
    await page.addScriptTag({ path: 'dist/squid-core-ui.js' });
    return await page.$('body');
};