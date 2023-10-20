import { Container } from "@chakra-ui/react" 
import { Navigate, Route, Routes } from "react-router-dom" 
import Header from "./components/Header" 
import HomePage from "./pages/HomePage" 
import AuthenticationPage from "./pages/AuthenticationPage" 
import PostPage from "./pages/PostPage" 
import UserPage from "./pages/UserPage" 
import { useRecoilValue } from "recoil" 
import userAtom  from "./atoms/userAtom" 
import LogoutButton from "./components/LogoutButton" 
import UpdateProfilePage from "./pages/UpdateProfilePage" 
import CreatePost from "./components/CreatePost" 

function App() {
  const user = useRecoilValue(userAtom) // getting the user from the userAtom
  return (
    <Container maxW = "620px">
      <Header/>
      {/* Use React Router Dom Route Component to set up routes */}
      <Routes>
        <Route path = "/" element = {user ? <HomePage/> : <Navigate to = "/auth"/> }/>
        <Route path = "/auth" element = {!user ?<AuthenticationPage/> : <Navigate to = "/"/>}/>
        <Route path = "/update" element = {user ?<UpdateProfilePage/> : <Navigate to = "/auth"/>}/>
        <Route path = "/:username" element = {<UserPage/>}/>
        <Route path = "/:username/post/:pid" element = {<PostPage/>}/>
      </Routes>
      {/* Adding Buttons based on whether user is logged in or not */}
      {user && <LogoutButton/>}
      {user && <CreatePost/>}
    </Container>
  )
}

export default App
