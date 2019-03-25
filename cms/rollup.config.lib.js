import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
// import includePaths from 'rollup-plugin-includepaths';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
// import string from 'rollup-plugin-string';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';

var includePathOptions = {
    paths: ['node_modules'],
};

export default {
    input: 'cms/client/scripts/lib.js',
    output: {
        format: 'iife',
        name: 'lib',
        file: 'cms/client/public/lib.min.js',
        // exports: 'named',
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM',
            'prop-types': 'PropTypes',
            moment: 'moment',
            warning: 'warning',
            bluebird: 'Promise',
            'react-dropzone': 'DropZone',
            'react-jsonschema-form': 'Form',
            'react-datepicker': 'DatePicker',
            'react-medium-editor': 'ReactMediumEditor',
        },
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
            module: true,
        }),
        // globals(),
        json(),
        builtins(),
        commonjs({
            include: './node_modules/**',
            namedExports: {
                'node_modules/react/index.js': ['createElement', 'Component'],
                'node_modules/react-dom/index.js': ['findDOMNode'],
            },
        }),
        babel({
            externalHelpers: true,
            exclude: 'node_modules/**',
        }),
        // string({
        // Required to be specified
        // include: ['**/*.json'],
        // }),
        // eslint(),
    ],
};
