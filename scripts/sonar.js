const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
  serverUrl : process.env.SONAR_URL||'https://<sonar-url>/',
  options : {
    'sonar.sources': 'dist',
    'sonar.tests': 'test/',
    'sonar.inclusions': 'dist/**/*.js',
    'sonar.exclusions': 'dist/tokens/tokens.js,test/*.js,dist/*.js,dist/ink.min.js,dist/ink-es5.min.js,dist/ink.js,dist/ink-es5.js,dist/build.js',
    'sonar.javascript.lcov.itReportPath': 'coverage/lcov.info',
    'sonar.javascript.lcov.reportPath': 'coverage/lcov-report'
  }
}, ()=>{
  console.log('DONE?');
});