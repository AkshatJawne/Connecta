import { Button } from "@chakra-ui/react"
import {useSetRecoilState } from "recoil" 
import userAtom from "../atoms/userAtom" 
import useShowToast from "../hooks/useShowToast" 
import {FiLogOut } from "react-icons/fi" 

 const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom) 
    const showToast = useShowToast() 
    const handleLogout = async () => {
        try {
            // logout user request
            const res = await fetch("/api/users/logout", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }
            })
            const data = await res.json() 
            if (data.error) {
                showToast("Error", data.error, "error")    
                return  
            }
            // remove user from local storage and set user to null
            localStorage.removeItem("user-connecta") 
            setUser(null) 
        } catch (err) {
            showToast("Error", err, "error")  
        }
    }
   return (
    // Creates a LogoutButton component that will be used in the ProfilePage component.
     <Button
     position={"fixed"}
     top = {"30px"}
     right = {"30px"}
     size = {"sm"}
     onClick = {handleLogout}
     ><FiLogOut size = {20}/></Button>
   )
 }
 
 export default LogoutButton