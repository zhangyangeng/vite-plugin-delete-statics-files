import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'rollup';
import { dts } from 'rollup-plugin-dts';

export default defineConfig([
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/index.js',
				format: 'cjs'
			},
			{
				file: 'dist/index.esm.js',
				format: 'module'
			},
			{
				file: 'dist/index.min.js',
				format: 'umd',
                name: 'vite-plugin-delete-statics-files'
			}
		],
		external: ['vite'],
		plugins: [
            // TypeScript 编译插件
			typescript(),
			terser()
		]
	},
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'esm',
        },
        plugins: [dts()]
    }
]);
