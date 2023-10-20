import { useState } from 'react' 
import useShowToast from './useShowToast' 

const usePreviewImage = () => {
    const [imgUrl, setImgUrl] = useState(null) // state to store image url
    const showToast = useShowToast() 
    const handleImageChange = (e) => {
        const file = e.target.files[0] // get the first file from the list of files
        if (file && file.type.startsWith("image/")) { // check if file is an image
            const reader = new FileReader() // create a new file reader
            
            reader.onloadend = () => {
                setImgUrl(reader.result) // set the image url to the result of the file reader
            }

            reader.readAsDataURL(file) // read the file as a data url
        } else {
            showToast("Invalid file type ", "Please upload an image file", "error") // show error toast
            setImgUrl(null)  
        }
    } 
  return {handleImageChange, imgUrl, setImgUrl}
}

export default usePreviewImage