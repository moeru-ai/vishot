import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: false,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
})
