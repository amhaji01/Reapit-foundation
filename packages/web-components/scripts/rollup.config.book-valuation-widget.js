import svelte from 'rollup-plugin-svelte'
import baseConfig from './rollup.config.base'
import replace from '@rollup/plugin-replace'
import path from 'path'
import generateRollupOutput from './generate-rollup-output'
import generateCssOutput from './generate-css-output'
import themesConfigurations from './rollup.config.themes.js'
import autoPreprocess from 'svelte-preprocess'

const config = require(path.resolve(__dirname, '..', 'config.json'))

const production = !process.env.ROLLUP_WATCH

export const baseConfigurationWithoutTheme = {
  ...baseConfig,
  input: 'src/book-valuation-widget/client/core/index.ts',
  output: generateRollupOutput({ production, fileName: 'book-valuation-widget', name: 'bookValuationWidget' }),
  plugins: [
    svelte({
      dev: !production,
      css: css => generateCssOutput({ css, fileName: 'book-valuation-widget.css', production }),
      preprocess: autoPreprocess(),
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(config.NODE_ENV),
    }),
    ...baseConfig.plugins,
  ],
}
let configurations = [baseConfigurationWithoutTheme]

if (!production) {
  configurations.push(themesConfigurations)
}

export default configurations
