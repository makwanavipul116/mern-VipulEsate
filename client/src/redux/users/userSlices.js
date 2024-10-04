import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: false
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true

        },

        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailuar: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        userUpdateStart: (state) => {
            state.loading = true
        },
        userUpdateSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        userUpdateFailuar: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutStart: (state) => {
            state.loading = true
        },

        signOutSuccess: (state, action) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        signOutFailuar: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        userDeleteStart: (state) => {
            state.loading = true
        },

        userDeleteSuccess: (state, action) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        userDeleteFailuar: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    signInStart,
    signInSuccess,
    signInFailuar,
    userUpdateStart,
    userUpdateSuccess,
    userUpdateFailuar,
    signOutStart,
    signOutSuccess,
    signOutFailuar,
    userDeleteStart,
    userDeleteSuccess,
    userDeleteFailuar,
} = userSlice.actions

export default userSlice.reducer