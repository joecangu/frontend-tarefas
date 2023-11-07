import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function Private({ children }){
    const { signed, token, loading } = useContext(AuthContext);

    if(loading){
        return(
            <div>
                
            </div>
        )
    }

    if(!signed || token == null){
        return <Navigate to="/"/>
    }

    return children;
}