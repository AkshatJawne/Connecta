import {atom} from "recoil" 

// authAtom is used to keep track of whether the user is logged in or not
const authAtom = atom ({
    key: "authAtom",
    default: "login",  
})

export default authAtom 