import * as dotenv from 'dotenv'
dotenv.config()

console.log('Checking environment variables:')
console.log('GMAIL_USER:', process.env.GMAIL_USER)
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***[SET]***' : '***[NOT SET]***') 