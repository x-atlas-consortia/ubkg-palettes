import path from 'path'
import {promises as fs} from 'fs'

const COLOR_CACHE_PATH = path.join(process.cwd(), 'docs')
export default async function handler(req, res) {
  try {
    const filePath = COLOR_CACHE_PATH + `/palettes.json`

    const createFile = async (data) => {
      await fs.mkdir(path.dirname(filePath), {recursive: true}).then(function () {
          fs.writeFile(filePath, JSON.stringify(data), 'utf8')
      })
    }

    createFile(req.body)
  } catch (e) {

  }
  res.status(200).json([]);
}
