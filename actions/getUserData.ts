import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getUserData = createServerFn({
    method: 'GET'
}).handler(async () => {
    const activeUser = getCookie('activeUser')
    console.log(activeUser)

    await new Promise(resolve => {
        // wait for 5 seconds to see the bug
        return setTimeout(resolve, 1000 * 5); 
    })
    return {
        foo: 'bar',
        activeUser
    }
    
})