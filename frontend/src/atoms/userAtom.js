import {atom} from "recoil" 


// userAtom is used to keep track of the user
const userAtom = atom({
    key: "userAtom",
    default: JSON.parse(localStorage.getItem("user-connecta")),
})

export default userAtom 