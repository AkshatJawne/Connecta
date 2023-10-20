import { useEffect, useState } from "react"
import { useParams } from "react-router-dom" 
import UserHeader from "../components/UserHeader"
import useShowToast from "../hooks/useShowToast"
import Post from "../components/Post"
import useGetUserProfile from "../hooks/useGetUserProfile"

const UserPage = () => {
  const {user} = useGetUserProfile() // getting the user from the userAtom
  const [posts, setPosts] = useState([]);
  const {username} = useParams()  // pulls username from the url 
  const showToast = useShowToast() 

  useEffect(() => {    
   const getPosts = async () => {
    try {
      // fetch posts by user
      const res = await fetch(`/api/posts/user/${username}`);
      const data = await res.json();    
      setPosts(data)
    } catch (error) {
      showToast("Error", error, "error")
      setPosts([])
    }
  } 
    getPosts()
  }, [username, showToast])

  if (!user) return null;

  return (
    <>
        <UserHeader user = {user}/>
        {posts && posts.map((post) => ( // map through posts and render Post component
          <Post key = {post._id} post = {post} postedBy = {post.postedBy}/>
        ))} 
    </> 
  )
}

export default UserPage