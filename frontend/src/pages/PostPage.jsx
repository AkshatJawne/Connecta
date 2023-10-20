import { DeleteIcon } from "@chakra-ui/icons"
import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Actions from "../components/Actions" 
import useGetUserProfile from "../hooks/useGetUserProfile" 
import useShowToast from "../hooks/useShowToast"
import { formatDistanceToNow } from "date-fns"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import Comment from "../components/Comment"

 const PostPage = () => {
    const {user} = useGetUserProfile()
    const [post, setPost] = useState()
    const showToast = useShowToast()
    const {pid} = useParams()
    const currentUser = useRecoilValue(userAtom)
    const navigate = useNavigate();

    useEffect(() => {
        const getPost = async () => {
            try { 
                // fetch post by id
                const res = await fetch(`/api/posts/${pid}`)
                const data = await res.json()
                if (data.error) {
                    showToast("Error", data.error, "error")
                    return
                }
                setPost([data]);
                
            } catch (error) {
                showToast("Error", error.message, "error")
            }  
        }
        getPost();
    }, [showToast, pid])

    const handleDeletePost = async () => {
    try {
        // show window to ensure that user can verify intent to delete post
        if(!window.confirm("Are you sure you want to delete this post?")) return;
        // delete post through delete request
        const res = await fetch (`/api/posts/${post._id}`, {
            method: "DELETE"})
        const data = await res.json()
        if (data.error) {
            showToast('Error', data.error, 'error')
            return
        }
        showToast('Success', data.message, 'success')
        // redirect to user page
        navigate(`/${user.username}`)
    } catch (error) {
        showToast('Error', error, 'error')
    }
  }

    if (!post) return null;

    return (
    <>
    {/* // Render post */}
        <Flex>
            <Flex w= {"full"} alignItems={"center"} gap = {3}>
                <Avatar src = {user?.profilePic} size = {"md"} name = {user.name}></Avatar>
                <Flex>
                    <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
                    <Image src = {"/verified.png"} w ={4} h = {4} ml = {4} />
                </Flex>
            </Flex>
            <Flex gap = {4} alignItems = {"center"}>
                <Text fontSize = {"xs"} width = {36} textAlign = {"right"} color = {"gray.light"}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
                    {currentUser?._id === user._id && ( // if current user is the same as the user who posted, show delete icon
                         <DeleteIcon size = {20} cursor = {"pointer"} onClick = {handleDeletePost}/>
                )}
            </Flex>
        </Flex>
        <Text my = {3}>{post.text}</Text>

        {post.img && (
            <Box
                borderRadius={6}
                overflow= {"hidden"}
                border = {"1px solid"}
                borderColor={"gray.light"}
                >
                <Image src = {post.img}  w= {"full"}/>
            </Box> 
        )}
 
        <Flex gap = {3} my = {3}>
            <Actions post = {post} />
        </Flex>

        <Divider my = {4} /> 

        {/* meant to simulate platforms like Threads with this specific design choice, where user is implored to install app for better experience */}
        <Flex justifyContent={"space-between"}>
            <Flex gap = {2} alignItems={"center"}>
                <Text fontSize={"2xl"}>🤝</Text>
                <Text color = {"gray.light"}>Get the app to like, reply, and post</Text>
            </Flex>
            <Button>Get</Button>
        </Flex> 
        <Divider my = {4} /> 
        {post.replies.map((reply) => ( // map through replies and render Comment component
            <Comment key = {reply._id} reply = {reply} lastReply = {reply._id === post.replies[post.replies.length -1]._id}/>
        ))}
    </>
  )
}

export default PostPage
