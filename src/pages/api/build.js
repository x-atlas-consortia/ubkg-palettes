import path from 'path'
import {promises as fs} from 'fs'

const COLOR_CACHE_PATH = path.join(process.cwd(), 'docs')
export default async function handler(req, res) {
  let code = 200
  let msg = `Built ${req.body.context}`
  try {
    const filePath = COLOR_CACHE_PATH + `/${req.body.context}/palettes.json`

    const createFile = async (data) => {
      await fs.mkdir(path.dirname(filePath), {recursive: true}).then(function () {
          fs.writeFile(filePath, JSON.stringify(data), 'utf8')
      })
    }

  
    createFile(req.body.data)
    
  } catch (e) {
    code = 500
    msg = e.toString()
    console.error(e)
  }
  res.status(code).json({msg});
}
