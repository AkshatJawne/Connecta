import {Flex, Spinner} from "@chakra-ui/react" 
import { useEffect, useState } from "react" 
import Post from "../components/Post" 
import useShowToast from "../hooks/useShowToast" 

const HomePage = () => {
    const [posts, setPosts] = useState([]) // state to store posts
    const [loading, setLoading] = useState(true) 
    const showToast = useShowToast() 
    useEffect(() => {
        setLoading(true)
        const getFeedPosts = async () => {
            try {
                // fetch posts for users' feec
                const res = await fetch("/api/posts/feed")  
                const data = await res.json() 
                if (data.error) {
                    showToast("Error", data.error, "error") 
                    return  
                }
                // if no errors, set posts to json response
                setPosts(data) 
            } catch (error) {
                showToast("Error", error, "error") 
            } finally {
                setLoading(false)
            }
        }
        getFeedPosts() 
    }, [showToast]) 
    return (
        <>
        {/* if current user does not follow anybody, then show message */}
        {!loading && posts.length === 0 && <h1>Follow some users to see posts!</h1>}

        {loading && (
            <Flex justify={"center"}>
                <Spinner size="xl"/>
            </Flex>
        )}
        {console.log(posts)}
        {posts.map((post) => ( // map through posts for feed and render Post component
            <Post key = {post._id} post = {post} postedBy = {post.postedBy}/>
        ))}
        </>
    ) 
}

export default HomePage 