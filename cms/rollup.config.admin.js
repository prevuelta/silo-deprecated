import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
// import includePaths from 'rollup-plugin-includepaths';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import string from 'rollup-plugin-string';
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';

var includePathOptions = {
    paths: ['node_modules'],
};

export default {
    external: [
        'react',
        'react-dom',
        'react-router-dom',
        'bluebird',
        'moment',
        'prop-types',
        'warning',
        'react-dropzone',
        'react-datepicker',
        'react-jsonschema-form',
        'react-medium-editor',
    ],
    input: 'cms/client/scripts/app.js',
    output: {
        format: 'iife',
        name: 'silo_admin',
        file: 'cms/client/public/app.min.js',
        globals: {
            react: 'lib.React',
            'react-dom': 'lib.ReactDOM',
            bluebird: 'lib.Promise',
            moment: 'lib.moment',
            'prop-types': 'lib.PropTypes',
            warning: 'lib.warning',
            'react-dropzone': 'lib.DropZone',
            'react-jsonschema-form': 'lib.Form',
            'react-datepicker': 'lib.DatePicker',
            'react-router-dom': 'lib.ReactRouterDOM',
            'react-medium-editor': 'lib.ReactMediumEditor',
        },
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        json(),
        // globals(),
        builtins(),
        // string({
        // Required to be specified
        // include: ['**/*.json'],
        // }),
        commonjs({
            include: './node_modules/**',
            namedExports: {
                'node_modules/react-dom/index.js': ['findDOMNode'],
                'node_modules/react/index.js': ['Component'],
                'node_modules/react-jsonschema-form/lib/components/fields/SchemaField': [
                    'SchemaField',
                ],
            },
        }),
        babel({
            externalHelpers: true,
            exclude: 'node_modules/**',
        }),
        // eslint(),
    ],
};
