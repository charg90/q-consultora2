import Image from 'next/image'
import EconomyImage from '../public/economy.png'
import Quality from '../public/quality.png'
import Soluciones from '../public/solucionesEmpresariales.png'
import Contenido from '../public/nuestro contenido.png'
import Nosotros from '../public/nosotros.png'
import EconomGestion from './Components/EconomGestion'

export default function Home() {
  return (
    <div className='w-full '>
      <Image src={EconomyImage} alt='Economy' />
      <Image src={Quality} alt='Quality' />
      <EconomGestion />
      <Image src={Soluciones} alt='Economy' />
      <Image src={Contenido} alt='Economy' />
      <Image src={Nosotros} alt='Economy' />
    </div>
  )
}
