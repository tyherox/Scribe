'use strict';

var path = require('path');
var jetpack = require('fs-jetpack');
var rollup = require('rollup').rollup;
var babel = require('rollup-plugin-babel');

var nodeBuiltInModules = ['assert', 'buffer', 'child_process', 'cluster',
    'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events',
    'fs', 'http', 'https', 'module', 'net', 'os', 'path', 'process', 'punycode',
    'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers',
    'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

var electronBuiltInModules = ['electron'];

var generateExternalModulesList = function () {
    var appManifest = jetpack.read('./package.json', 'json');
    return [].concat(
        nodeBuiltInModules,
        electronBuiltInModules,
        Object.keys(appManifest.dependencies),
        Object.keys(appManifest.devDependencies)
    );
};

var cached = {};

module.exports = (src, dest, opts) => {
    const options = opts || {};

    const plugins = [
        babel({
            exclude: 'node_modules/**'
        })
    ];

    return rollup({
        input: src,
        external: generateExternalModulesList(),
        cache: cached[src],
        plugins: plugins.concat(options.rollupPlugins || []),
    })
        .then((bundle) => {
            cached[src] = bundle;

            const jsFile = path.basename(dest);
            return bundle.generate({
                format: 'cjs',
                sourcemap: true,
                sourcemapFile: jsFile,
            }).then(result => {
                // Wrap code in self invoking function so the constiables don't
                // pollute the global namespace.
                const isolatedCode = `(function () {${result.code}\n}());`;
                return Promise.all([
                    jetpack.writeAsync(dest, `${isolatedCode}\n//# sourceMappingURL=${jsFile}.map`),
                    jetpack.writeAsync(`${dest}.map`, result.map.toString()),
                ]);
            })
        })
        .catch(e => {
            console.error(e);
            throw e;
        });
};
