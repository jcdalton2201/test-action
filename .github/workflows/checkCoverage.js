const core = require('@actions/core');
const github = require('@action/gihub');

try {
    console.log('we are here');
} catch (error) {
    core.setFailed(error.message)
}