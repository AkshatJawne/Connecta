import { Flex, useColorMode } from "@chakra-ui/react"
import { Image } from "@chakra-ui/react"
import { Link } from "react-router-dom" 
import { useRecoilValue } from "recoil" 
import userAtom from "../atoms/userAtom" 
import { AiFillHome } from "react-icons/ai" 
import { RxAvatar } from "react-icons/rx" 
import {Link as RouterLink} from "react-router-dom" 

const Header = () => {
    const {colorMode, toggleColorMode} = useColorMode() 
    const user = useRecoilValue(userAtom)  
  return (
    <Flex justifyContent={"center"} mt = {6} mb = "12" alignContent={"center"}>
      {/* // if user is logged in, show home icon with link to home page */}
      <Flex justifyContent={"space-around"} alignItems ={"center"} gap ={56}>
        {user && (
          <Link as={RouterLink} to = "/">
            <AiFillHome size = {24}/>
          </Link>
        )}

          {/* // show logo with link to home page */}
          <Image
          cursor={"pointer"}
          alt = "logo"
          w={20}
          h={20}
          src = {colorMode === "dark" ? "/light-logo.png" : "./dark-logo.png"} 
          onClick = {toggleColorMode}
          />

          {/* if user is logged in, show avatar with link to user profile */}
          {user && (
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size = {24}/>
          </Link>
        )}
      </Flex>
    </Flex>
  )
}

export default Header