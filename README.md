# Markdown Mail

Design and serve beautiful email using markdown.

## Development

```bash
# Create a `/mails` directory with a starter template.
npx markdown-mail --init

# Start the dev server to design your mails.
npx markdown-mail
```

## API

```ts
import { parseMail } from './mail'
import { join } from 'path'

// define root directory for your mails
const root = join(process.cwd(), 'mails')

// prase your mails
const mail = await parseMail(root, file)

// types:
const parseMail: (root: string, file: string, cache?: boolean) => Promise<string | undefined>

// "cache" is not implemented yet.
```
