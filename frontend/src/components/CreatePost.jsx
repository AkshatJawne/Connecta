import { AddIcon } from "@chakra-ui/icons"
import {Button, 
        useColorModeValue, 
        useDisclosure, 
        Modal, 
        ModalOverlay, 
        ModalContent,
        ModalHeader, 
        ModalCloseButton, 
        ModalBody, 
        ModalFooter,
        FormControl,
        Textarea,
        Text,
        Input,
        Flex,
        Image,
        CloseButton} from "@chakra-ui/react"
import { useRef, useState } from "react" 
import { BsFileImageFill } from "react-icons/bs" 
import { useRecoilValue } from "recoil" 
import userAtom from "../atoms/userAtom" 
import usePreviewImage from "../hooks/usePreviewImage" 
import useShowToast from "../hooks/useShowToast" 

const MAX_CHAR = 500  // max characters for post text

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure() 
  const [postText, setPostText] = useState("") 
  const [remainingCharacters, setRemainingCharacters] = useState(MAX_CHAR) 
  const imageRef = useRef(null) 
  const {handleImageChange, imgUrl, setImgUrl} = usePreviewImage() // use custom hook to handle image logic
  const user = useRecoilValue(userAtom)  
  const showToast = useShowToast() 

  const handleChange = (e) => {
    const inputText = e.target.value // get input text  
    
    // truncate text if it exceeds max characters
    if (inputText.length > MAX_CHAR) { 
        const truncatedText = inputText.slice(0, MAX_CHAR) 
        setPostText(truncatedText) 
        setRemainingCharacters(0) 
    } else {
      // otherwise, set the post text and update remaining characters
        setPostText(inputText)  
        setRemainingCharacters(MAX_CHAR - inputText.length) 
    }
  } 

  const handleCreatePost = async () => {
    const res = await fetch("api/posts/create", {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
         body: JSON.stringify({
            postedBy: user._id, 
            text: postText, 
            img: imgUrl})})
            //create post object      
    const data = await res.json() 
    if (data.error) {
        showToast("Error", data.error, "error") 
        return 
    }
    showToast("Success", "Post created", "success")  
    setPostText("")  // reset post text
    setImgUrl("")  //   reset image url
    onClose()  // close modal
  }

  return (
    <>
        <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon = {<AddIcon/>}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick = {onOpen}
        >
        Post
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
                <Textarea
                placeholder ={"What's on your mind?"}
                onChange ={handleChange}
                value = {postText}
                />
                <Text
                    fontSize={"xs"}
                    fontWeight={"bold"}
                    textAlign={"right"}
                    m={1}
                    color ={"gray.800"}
                >
                  {/* shows counter for remaining characters */}
                    {remainingCharacters}/{MAX_CHAR }
                </Text>
                {/* logic to implement image in post */}
                <Input
                    type={"file"}
                    hidden
                    ref ={imageRef}
                    onChange={handleImageChange}
                />
                <BsFileImageFill
                    style={{marginLeft: "5px", cursor: "pointer"}}
                    size={25}
                    onClick={() => imageRef.current.click()}
                />
            </FormControl>

            {/* show image preview if image is selected */}
            {imgUrl && (
                <Flex mt={5} w={"full"} position={"relative "}>
                    <Image src ={imgUrl} alt = "Selected image" />
                    <CloseButton 
                    onClick = {()=> setImgUrl("")}
                    bg={"gray.300"}
                    position={"absolute"}
                    top={2}
                    right={2}
                    /> 
                </Flex>
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost}>
              Post 
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

     </>
  )
}

export default CreatePost