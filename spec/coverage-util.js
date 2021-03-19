const v8ToCoverage = require('./v8_to_coverage');
const pti = require('puppeteer-to-istanbul');
v8ToCoverage._baseDir =  __dirname.replace('spec','');

/**
 * start the coverage for page.
 * @param {Page} page puppetter page
 */
module.exports.startCoverage =  function createPage(page) {
    return Promise.all([page.coverage.startJSCoverage()]);
};

/**
 * stop the coverage for a page
 * @param {PAge} page puppetter page
 */
module.exports.stopCoverage =  function createPage(page) {
    return Promise.all([page.coverage.stopJSCoverage()]);
};

/**
 * 
 * @param {Coverage} jsCoverage 
 * @param {Object} config 
 */
module.exports.displayCoverage =async function displayCoverage(jsCoverage, config = { include:[]}) {
    try {
        const coverage = [...jsCoverage];
        const tracked = coverage.filter((item) => {
            return config.include.includes(item.url.substring(item.url.lastIndexOf('/') + 1));
        });
        for (let index = 0; index < tracked.length; index++) {
            if(tracked[index].text.includes('//# sourceMappingURL=')){
                await v8ToCoverage.write(tracked[index]);
            } else {
                pti.write(jsCoverage);
            }
        }
            
    } catch (error) {
        console.error(error);
    }
};