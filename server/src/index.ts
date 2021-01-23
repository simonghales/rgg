import { App } from '@tinyhttp/app'
import cors from 'cors'
import * as fs from 'fs/promises'
import path from "path"
// import * as prettier from 'prettier'
// import * as codemod from '@codemod/core'

const app = new App()

app.use(cors({ origin: true }))

app.get('/', (request, response) => {
    console.log('request made...')
    response.sendStatus(200)
})

// @ts-ignore
app.post(`/component/new`, (request, response) => {
    console.log('request has been made')
    let bodyBuffer: any[] = []
    request
        .on('error', (err) => {
            console.error(err)
        })
        .on('data', (chunk) => {
            bodyBuffer.push(chunk)
        })
        .on('end', async () => {
            const body: any = JSON.parse(
                Buffer.concat(bodyBuffer).toString()
            )

            // get line number
            // get column number
            const lineNumber = 0
            const columnNumber = 0

            console.log('body', body)
            const logsPath = path.resolve(__dirname, '../tmp/logs.txt')
            const logsBuffer = await fs.readFile(logsPath)
            const updatedLogsString = logsBuffer.toString() + `\n` + [lineNumber, columnNumber].join(',')
            await fs.writeFile(logsPath, updatedLogsString)
            const fileBuffer = await fs.readFile('/Users/simonhales/WebstormProjects/engine/site/src/components/Test.tsx')
            console.log('logs', logsBuffer.toString())

            const updatedString = fileBuffer.toString().replace('{/*inject*/}',
`{/*inject*/}
<div>
    hello world
</div>`)

            await fs.writeFile('/Users/simonhales/WebstormProjects/engine/site/src/components/Test.tsx', updatedString)

            // const prettierOptions = await prettier.resolveConfig(body.source.fileName)
            // const transformedFile = codemod.transform(fileBuffer.toString(), {
            //     plugins: [[plugin, body]],
            // })
            // const formattedCode = prettier.format(
            //     transformedFile.code,
            //     prettierOptions
            // )
            // try {
            //     await fs.writeFile(body.source.fileName, formattedCode)
            //     response.sendStatus(200)
            // } catch (err) {
            //     response.sendStatus(500)
            // }
            response.sendStatus(200)
        })
})

app.listen(4000)