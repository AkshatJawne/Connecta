import Signup from "../components/Signup"
import Login from "../components/Login"
import { useRecoilValue } from "recoil"
import authAtom from "../atoms/authAtom"

const AuthenticationPage = () => {
    const authState = useRecoilValue(authAtom) // getting the user from the userAtom
  return (
    <>
        {authState === "login" ? <Login/> : <Signup/>}
    </> 
  )
}

export default AuthenticationPage