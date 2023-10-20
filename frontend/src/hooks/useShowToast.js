import { useToast } from "@chakra-ui/react"  
import { useCallback } from "react" 

const useShowToast = () => {
    // use the useToast hook from Chakra UI
    const toast = useToast() 
    const showToast = useCallback((title, description, status) => { // useCallback to increase performance
        toast({
            title,
            description,
            status,
            duration: 5000,
            isClosable: true, 
        }) 
    }, [toast])
     
    return showToast 
}

export default useShowToast 