export const signIn = () => {
    return {
        type: 'SIGN_IN'
    };
}

export const signOut = () => {
    return { 
        type: 'SIGN_OUT'
    };
}

export const setUser = (user) => {
    return {
        type: 'SET_USER',
        user: user
    };
}

export const unsetUser = () => {
    return {
        type: 'UNSET_USER'
    };
}

export const showLoading = (params) => {
    return {
        type: 'SHOW_LOADING',
        reset: params.reset,
        count: params.count
    };
}

export const doneLoading = (resetAll) => {
    return {
        type: 'DONE_LOADING',
        resetAll: resetAll
    };
}