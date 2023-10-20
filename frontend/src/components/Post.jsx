import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import Actions from "./Actions"
import { formatDistanceToNow } from "date-fns"
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
 
 const Post = ({post, postedBy }) => {
  const [user, setUser] = useState(null)   
  const showToast = useShowToast() 
  const currentUser = useRecoilValue(userAtom); 
  const navigate = useNavigate() 

  useEffect(()=> {
    const getUser = async () => {
        try {
            const res = await fetch("api/users/profile/" + postedBy) // fetch user profile
            const data = await res.json()  
            if (data.error) {
                showToast('Error', data.error, 'error') 
                return 
            } 
            setUser(data) // set user to data
        } catch (error) {
            showToast('Error', error, 'error')
            setUser(null)  
        }
    }  
    getUser() 
  }, [postedBy, showToast])

  const handleDeletePost = async (e) => {
    try {
        e.preventDefault(); // prevent default behavior
        if(!window.confirm("Are you sure you want to delete this post?")) return; // confirm delete
        const res = await fetch (`/api/posts/${post._id}`, {
            method: "DELETE"})
        const data = await res.json()
        if (data.error) {
            showToast('Error', data.error, 'error')
            return
        }
        showToast('Success', data.message, 'success')
    } catch (error) {
        showToast('Error', error, 'error')
    }

  }
  if (!user) return null  // if user is null, return null
   
  return (
    <Link to = {`/${user.username}/post/${post._id}`}> 
    {/* link to post page */}
        <Flex gap = {3} mb = {4} py = {5}>
            <Flex flexDirection = {"column"} alignItems = {"center"}>
                <Avatar size = {"md"} name = {user?.name} src ={user?.profilePic}
                    onClick = {(e) => {
                        e.preventDefault()
                        navigate(`/${user?.username}`)
                    }}
                />
                <Box w = {"1px"} h = {"full"} bg = "gray.light" my = {2}></Box>
                <Box position = {"relative"} w = {"full"}>
                    {post.replies.length === 0 && (<Text textAlign = "center" size = {"xs"}>😐</Text>)}
                    {post.replies[0] && ( //format to have three most recent replies highlighted
                        <Avatar 
                        size = {"xs"} 
                        name = {"John Doe"}
                        src = {post.replies[0].postedBy?.profilePic}
                        position = {"absolute"} 
                        top = {"0px"}
                        left = {"15px"}
                        padding = {"2px"}
                        />
                    )}
                    {post.replies[1] && (
                        <Avatar 
                        size = {"xs"} 
                        name = {"John Doe"}
                        src = {post.replies[1].postedBy?.profilePic}
                        position = {"absolute"} 
                        bottom = {"0px"}
                        right = {"-5px"}
                        padding = {"2px"}
                        />
                    )}
                    {post.replies[2] && (
                        <Avatar 
                        size = {"xs"} 
                        name = {"John Doe"}
                        src = {post.replies[2].postedBy?.profilePic}
                        position = {"absolute"} 
                        bottom  = {"0px"}
                        left = {"4px"}
                        padding = {"2px"}
                        />
                    )} 
                </Box>
            </Flex>
            <Flex flex = {1} flexDirection = {"column"} gap = {2}>
                <Flex justifyContent={"space-between"} w ={"full"}>
                    <Flex w = {"full"} alignItems = {"center"}>
                        <Text fontSize  = {"small"} fontWeight = {"bold"}
                        onClick = {(e) => { 
                        e.preventDefault()
                        navigate(`/${user?.username}`)}}
                        >{user?.username}</Text>
                        <Image src = " /verified.png" w = {4} h = {4} ml = {1} />
                    </Flex>
                    <Flex gap = {4} alignItems = {"center"}>
                        {/* format date */}
                          <Text fontSize = {"xs"} width = {36} textAlign = {"right"} color = {"gray.light"}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
                           {currentUser?._id === user._id && ( // only show delete icon if current user is the same as the user who posted
                                <DeleteIcon size = {20} onClick = {handleDeletePost}/>
                           )}
                    </Flex>
                </Flex>
                <Text fontSize = {"small"}>{post.text}</Text>
                {post.img &&  // if post has image, display it
                 <Box
                borderRadius={6}
                overflow= {"hidden"}
                border = {"1px solid"}
                borderColor = {"gray.light"}
                >
                 <Image src = {post.img}  w = {"full"}/>
                </Box>
                }
                <Flex my = {1} gap = {3}>
                    <Actions post = {post} />
                </Flex>
            </Flex>
        </Flex>
    </Link>
  )
}

export default Post 