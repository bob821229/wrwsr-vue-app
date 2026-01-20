var Apis = {
    General: {
        token: {
            uri: '/api/Home/token', 
            method: 'get'
        }, 
        getGlossaryData: {
            uri: '/api/Home/getGlossaryData', 
            method: 'get'
        }
    }, 
    Account: {
        login: {
            uri: '/api/account/login', 
            method: 'post'
        }
    }
}
export {Apis}