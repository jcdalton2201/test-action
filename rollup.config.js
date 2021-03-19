import globby from 'globby';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postCSSPlugin from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';

const postCSS = postCSSPlugin({
    inject: false,
    minimize: {
        discardComments: true,
    },
});
const ignore = ['src/build.js', 'src/**/*stories.js'];
const files = globby.sync('src/**/*.js', { ignore });
console.log(files);
const external = files.map(file => path.resolve(__dirname, file));

const individualFiles = files.map(input => ({
    input,
    output: [
        {
            file: input.replace('src', 'dist'),
            format: 'esm',
        },
    ],
    external,
    plugins: [postCSS,postcssLit()],
}));

const bundelFiles = {
    input: 'src/build.js',
    output: [
        {
            file: 'dist/squid-core-ui.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [resolve(), commonjs(), postCSS, postcssLit()],
};
export default [...individualFiles, bundelFiles];
