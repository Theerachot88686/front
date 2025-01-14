/* eslint-disable react/prop-types */
import axios from 'axios'
import {createContext, useState, useEffect} from 'react'

const AuthContext = createContext()

function AuthContextProvider(props) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  const run = async () => {
    try {
      setLoading(true)
      let userData = JSON.parse(localStorage.getItem("userData"));
      if(!userData) { return }
      setUser(userData);
    }catch(err) {
      console.log(err.message)
    }finally {
      setLoading(false)
    }   
  }

  useEffect( ()=>{
    run()
  }, [])
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={ {user, setUser, loading, logout,run} }>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthContextProvider }
export default AuthContext