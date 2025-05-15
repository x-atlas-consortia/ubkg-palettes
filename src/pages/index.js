import useContent from "@/hooks/useContent";
import axios from "axios";

export default function Home() {
  const content = useContent('sennet')

  const createPalettes = async () => {
    await axios.post('/api/build', content.ubkg)
  }
  return (
    <>
      <h1>UBKG Palettes</h1>
      <button onClick={() => createPalettes()}>Generate</button>
    </>
  );
}
