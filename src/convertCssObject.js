import sistyl from 'sistyl'
import stripIndent from 'strip-indent'

function stringifyImport (imp) {
  return `@import url(${JSON.stringify(imp)});`
}

function stringifyFont (font) {
  let sources = []
  if (typeof font.url === 'string') {
    sources.push(`url("${font.url}")`)
  }
  if (typeof font.url === 'object') {
    sources = Object.entries(font.url).map(([ type, url ]) =>
      `url("${url}") format("${type}")`)
  }

  return stripIndent(`
    @font-face {
      font-family: "${font.name}";
      src: ${sources.join(', ')};
    }
  `)
}

// Convert plugCubed-style CSS objects to CSS strings.
export default function convertCssObject (css) {
  let text =  '/* Converted from plug³ style object */\n\n'

  if (css.import && Array.isArray(css.import) && css.import.length > 0) {
    text += css.import.map(stringifyImport).join('\n') + '\n\n'
  }

  if (css.font && Object.keys(css.font).length > 0) {
    text += css.font.map(stringifyFont).join('') + '\n\n'
  }

  if (css.rule && typeof css.rule === 'object') {
    text += sistyl(css.rule)
  }

  return text
}
