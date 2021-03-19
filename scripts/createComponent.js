const chalk = require('chalk');
const mkdirp = require('mkdirp');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

class CreateComponent {
  constructor() {
    if (argv.name) {
      let paths = argv.name.split('/');
      let name = argv.name;
      let dir = '';
      if (paths.length > 1) {
        name = paths.pop();
        dir = `/${paths.join('/')}`;
      }
      console.log(
        chalk.green(
          `We are going to build component ${name} in dir ${chalk.yellow(dir)}`
        )
      );
      this._buildDir(name, dir);
      this._buildJs(name, dir);
      this._buildSpec(name, dir);
      this._buildSass(name, dir);
      this._buildStory(name, dir);
      this._buildReadMe(name, dir);
    } else {
      console.log(chalk.red('Please add the argument --name=<<name>>'));
    }
  }
  /**
   * This will convert slug string to Camel Cased
   * @param {String} val value of string to change
   */
  __camelCased(val) {
    return val
      .toLocaleLowerCase()
      .split('-')
      .map(item => item.replace(/^./, c => c.toLocaleUpperCase()))
      .join('');
  }
  /**
   *
   * @param {String} name
   * @param {String} dir
   */
  _buildDir(name, dir) {
    mkdirp.sync(`src${dir}/squid-${name}`);
    mkdirp.sync(`spec${dir}/squid-${name}`);
    console.log(chalk.green(`we have created a directory at src/squid-${name}`));
  }
  /**
   * 
   * @param {String} name 
   * @param {String} dir 
   */
  _buildStory(name, dir) {
    const file = `src${dir}/squid-${name}/squid-${name}.stories.js`;
    const writeStream = fs.createWriteStream(file);
    writeStream.write(`
import '../../dist/squid-${name}/squid-${name}.js';
import readme from './readme.md';
export default {
  title: '${name}'
};

const temp = (args) => {
  return \`<squid-${name}></squid-${name}\`;
}

export const ${name} = temp.bind({});
${name}.args ={
  inputMax:'',
  max:'',
  
};
${name}.story = {
  name: '${name}',
  parameters: {
    notes: {readme},
    argTypes:{}
  },
};
    `);
  }
  /**
   * 
   * @param {String} name 
   * @param {String} dir 
   */
  _buildSass(name, dir) {
    const file = `src${dir}/squid-${name}/squid-${name}.scss`;
    const writeStream = fs.createWriteStream(file);
    writeStream.write('');
  }
  /**
   * 
   * @param {String} name 
   * @param {String} dir 
   */
  _buildReadMe(name, dir) {
    const file = `src${dir}/squid-${name}/readme.md`;
    const writeStream = fs.createWriteStream(file);
    writeStream.write('');
  }
  /**
   *
   * @param {String} name
   * @param {String} dir
   */
  _buildJs(name, dir) {
    const file = `src${dir}/squid-${name}/squid-${name}.js`;
    const writeStream = fs.createWriteStream(file);
    writeStream.write(`
import {LitElement, html} from 'lit-element';
import { defineSquidElement } from '../utils/defineSquidElement.js';
import styles from './squid-${name}.scss';
export class Squid${this.__camelCased(name)} extends LitElement {
  static get styles() {
    return [styles];
  }
  static get properties() {
    return {}
  }
  render(){
    return html\`\`;
  }
}
defineSquidElement('squid-${name}',Squid${this.__camelCased(name)});
`);
  }
  /**
   * This will build a Puppetter tests.
   * @param {String} name
   * @param {String} dir
   */
  _buildSpec(name, dir) {
    const file = `spec${dir}/squid-${name}/squid-${name}.js`;
    const writeStream = fs.createWriteStream(file);
    writeStream.write(`
const difUtil = require('../diff-util.js');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const AxeUtil = require('../axe-util.js');
describe('Unit and Functional Tests for squid-${name}',()=>{
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
    it('Test the accessibility of ${name}',async()=>{
        browser = await difUtil.setTestName(
            'Test the accessibility of ${name}'
        );
        page = await difUtil.createPage(browser);
        const bodyhandle = await difUtil.createBodyHandle(page);
        await page.evaluate(element => {
            element.innerHTML =
                \`<squid-${name} >
                Test
                </squid-${name}>\`;
        }, bodyhandle);
        await page.waitForSelector('squid-${name}');
        const results = await new AxePuppeteer(page).include('squid-${name}').analyze();
        expect(AxeUtil.isValid(results)).toBeTruthy();
  });
});
`);
  }
}
new CreateComponent();
