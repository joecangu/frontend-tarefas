// IMPORT DA LIB DE LOADER
import { RotatingLines } from 'react-loader-spinner'

export default function Loader(){
  return(
    <div>
      <RotatingLines
        strokeColor="rgba(40, 67, 135, 1)"
        strokeWidth="5"
        animationDuration="0.75"
        width="50"
        visible={true}
      />
    </div>
  )
}