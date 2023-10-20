import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
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

const Signup = () =>  {
  const [showPassword, setShowPassword] = useState(false) // show/hide password state
  const setAuthState = useSetRecoilState(authAtom) 
  const [inputs, setInputs] = useState({
    name: "", 
    username: "",
    email: "", 
    password: "",
  }) // form inputs state
  
  const showToast = useShowToast() 
  const setUser = useSetRecoilState(userAtom) 

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/users/signup", {
        method: 'POST', 
        headers: {
          "Content-Type": 'application/json',
        }, 
        // send form data to backend
        body: JSON.stringify(inputs),
      })
      const data = await res.json() 
      if (data.error) {
         showToast("Error", data.error, "error") 
         return 
      }
      localStorage.setItem("user-connecta", JSON.stringify(data))  // save user data to local storage 
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
            Sign up
          </Heading> 
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'white.500')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                {/* Below are all form inpust containing data required to create account */}
                <FormControl isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input type="text"  onChange = {(e) => setInputs((inputs) => ({...inputs , name: e.target.value}))}
                  value = {inputs.name}
                  /> 
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text"  onChange = {(e) => setInputs((inputs) => ({...inputs , username: e.target.value}))}
                  value = {inputs.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="text"  onChange = {(e) => setInputs((inputs) => ({...inputs , email: e.target.value}))}
              value = {inputs.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type="text"  onChange = {(e) => setInputs((inputs) => ({...inputs , password: e.target.value}))}
                value = {inputs.password}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />} 
                     {/* show/hide password */}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg="green.500"
                color={'white'}
                _hover={{
                  bg: "blue.700"
                }}
                onClick = {handleSignup}
                >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                {/* Allow user to login if they already have an account */}
                Already a user? <Link color={'blue.400'}
                onClick={() => setAuthState("login")}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Signup 