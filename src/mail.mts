import fs from 'node:fs/promises'
import { join } from 'node:path'
import { parseMarkdown } from '@yandeu/parse-markdown'
import juice from 'juice'

const read = (root: string, file: string) => fs.readFile(join(root, file), { encoding: 'utf-8' })

const table = {
  open: (className?: string) =>
    `<table ${className ? `class="${className}"` : ''}cellpadding="0" cellspacing="0" border="0"><tr><td>`,
  close: () => `</td></tr></table>`
}

const parseMail = async (root: string, file: string, cache: boolean = false) => {
  try {
    const data = await read(root, file)
    const css = await read(root, 'styles.css')

    let { markdown, yaml } = await parseMarkdown(data)

    // remove empty lines
    markdown = markdown
      .split('\n')
      .filter(line => line !== '')
      .join('')

    // extract header, transform to .header
    let header: any = /<header>(.*)<\/header>/s.exec(markdown) || ''
    if (header) {
      markdown = markdown.replace(header[0], '')
      header = header[0].replace('<header>', table.open('header')).replace('</header>', table.close())
    }

    // extract footer, transform to .footer
    let footer: any = /<footer>(.*)<\/footer>/s.exec(markdown) || ''
    if (footer) {
      markdown = markdown.replace(footer[0], '')
      footer = footer[0].replace('<footer>', table.open('footer')).replace('</footer>', table.close())
    }

    // transform div to table
    const regex1 = /<div\s?(class="([^"]*)")?[^>]*>(.*?)<\/div>/gms
    let array1
    while ((array1 = regex1.exec(markdown)) !== null) {
      markdown = markdown.replace(array1[0], `${table.open(array1[2])}${array1[3]}${table.close()}`)
    }

    const html = `
        <!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Simple Transactional Email</title>
            <style type="text/css">${css}</style>
          </head>    
          <body>
            ${header}
            ${table.open('content')}
              ${markdown}
              ${table.close()}
            ${footer}
          </body>
        </html>
        `

    const mail = juice(html)

    // Recommended Code Snippet for Outlook.com (based on https://www.htmlemailcheck.com/check/)
    const snippet = /* css */ `.ExternalClass {width: 100%;}`

    return mail.replace(`"text/css">`, `"text/css">${snippet}`)
  } catch (error) {
    if (error instanceof Error) console.log(error.message)
    return
  }
}

/** alias for mail() */
const mail = parseMail

export { mail, parseMail }
