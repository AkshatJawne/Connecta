import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authAtom from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'

const Login = () =>  {
  const [showPassword, setShowPassword] = useState(false) 
  const setAuthState = useSetRecoilState(authAtom) // auth state
  const setUser = useSetRecoilState(userAtom) // user state
  const [inputs, setInputs] = useState({
    username: "",
    password: "", 
  }) 
  const showToast = useShowToast() 
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        // send form data to backend
        body: JSON.stringify(inputs),
      })

      const data = await res.json()  

      if (data.error) {
        showToast("Error", data.error, "error") 
        return  
      }
      // save user data to local storage
      localStorage.setItem("user-connecta", JSON.stringify(data)) 
      setUser(data) 

    } catch (err) {
      showToast("Error", err, "error")
    } 
  }
  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login 
          </Heading> 
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'white.500')}
          boxShadow={'lg'}
          p={8}
          width={{
            base: "full",
            sm: "400px",
          }}
          >
          <Stack spacing={4}>
            <FormControl isRequired>
              {/* Labels and corresponding labels for login form */}
              <FormLabel>Username</FormLabel>  
              <Input type="text " 
              value = {inputs.username}
              onChange = {(e) => setInputs((inputs) => ({...inputs , username: e.target.value}))} 
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} 
                value = {inputs.password}
                onChange = {(e) => setInputs((inputs) => ({...inputs , password: e.target.value}))}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                    >
                    {/* // Show password if showPassword is true, else show password off icon */}
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging in..."
                size="lg"
                bg="green.500"
                color={'white'}
                _hover={{
                  bg: "blue.700"
                }}
                onClick = {handleLogin} 
                >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              {/* If user does not have account, prompt them to signup page */}
              <Text align={'center'}>
                Don&apos;t have an account? <Link color={'blue.400'}
                onClick = {() => setAuthState("signup")}  
                >Sign up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Login 