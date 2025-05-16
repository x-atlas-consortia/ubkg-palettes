import getData from "@/lib/services";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState('')
  
  const print = (e) => {
    const $console = document.getElementById('js-console')
    $console.innerHTML = `${new Date().toLocaleString()} >>> <strong>${e}</strong>`
  }

  useEffect(()=> {
    setToken(localStorage.getItem('token'))
  }, [])

  const getToken = () => document.getElementById('js-token').value

  const createPalettes = async (context) => {
    
    try {
      const t = getToken()
      localStorage.setItem('token', t)
      const content = await getData(context, t)
      const r = await axios.post('/api/build', {data: content, context })
      console.log(r.data)
      print(r.data.msg)
    } catch(e) {
      print(e)
    }

  }
  return (
    <>
      <h1>UBKG Color Palettes</h1>
      <div>
        <p>Enter Token</p>
        <textarea name='token' id='js-token' value={token} onChange={()=> setToken(getToken())}></textarea>
      </div>
      <button onClick={() => createPalettes('sennet')}>Generate SenNet Color Palettes</button>
      <button onClick={() => createPalettes('hubmap')}>Generate HuBMAP Color Palettes</button>
      <div><code id="js-console"></code></div>
    </>
  );
}
