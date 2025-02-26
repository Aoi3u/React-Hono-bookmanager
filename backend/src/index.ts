import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

type BookManager = {
  id: number;
  name: string;
  status: string;
}

const bookManager: BookManager[] = [
  { id: 1, name: 'React入門', status: '在庫あり' },
  { id: 2, name: 'TypeScript入門', status: '貸出中' },
  { id: 3, name: 'Next.js入門', status: '返却済' },
];

app.get('/books', (c) => {
  return c.json(bookManager)
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port =  8080;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
