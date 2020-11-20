import {useCallback} from 'react'

export const useMessage = () => {
    return useCallback(text => {
        if (window.M && text) {
            window.M.toast({html: `<span class="material-icons-round">info</span> ${text}`})
        }
    }, [])
}