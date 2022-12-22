# Markdown Mail

Design and serve beautiful email using markdown.

## Development

```bash
# Create a `mails/` directory with a starter template.
npx markdown-mail --init

# Start the dev server to design your mails.
npx markdown-mail --open true

# Build the mails to the `dist/` folder.
npx markdown-mail --build
```

## API

```ts
import { parseMail } from 'markdown-mail'
import { join } from 'path'

// define root directory for your mails
const root = join(process.cwd(), 'mails')

// prase your mails
const mail = await parseMail(root, 'example.md')

// print the mail to the console
console.log(mail)

// types:
// parseMail(root: string, file: string, cache?: boolean): Promise<string>

// "cache" is not implemented yet.
```
