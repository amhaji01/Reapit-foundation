import 'isomorphic-fetch'
import yaml from 'yaml'
import path from 'path'
import fs from 'fs'
import server from './core/server'
import ejs from 'ejs'
;(global as any).navigator = {}

const envFile = fs.readFileSync(path.join(__dirname, '../env.yml'), 'utf8')
const env = yaml.parse(envFile as any)

process.env.COGNITO_USERPOOL_ID = env.dev.COGNITO_USERPOOL_ID
process.env.COGNITO_CLIENT_ID = env.dev.COGNITO_CLIENT_ID

const port = 3000

server.engine('ejs', ejs.renderFile)
server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, '/mailer/templates/ejs'))
server.get('/emails', (_req, res) => res.render('./index', { userName: 'tanphamhaiduong@gmail.com' }))

server.listen(port, () => console.log(`Dev app listening on port ${port}!`))
