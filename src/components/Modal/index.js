// CSS
import styles from './Modal.module.css';

// ÍCONES
import { FiX } from 'react-icons/fi';

export default function Modal({ children, titulo, close }){
  return(
    <div className={styles.modal}>
      <div className={styles.container}>
        <button className='btn-close' onClick={ close }>
          <FiX size={25} color="#FFF" />
        </button>
        <label>
          <span>{titulo}</span>
        </label>
        {children}
      </div>
    </div>
  )
}