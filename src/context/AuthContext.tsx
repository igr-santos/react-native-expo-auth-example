import React, { createContext, useMemo, useReducer } from 'react';


const initialState = {
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  userInfo: null,
}

const AuthContext = createContext({
  state: initialState,
  signIn: () => {},
  signOut: () => {},
})

const AuthProvider = ({ children }: any) => {
  const [authState, dispatch] = useReducer((previousState: any, action) => {
    switch (action.type) {
      case 'SIGN_IN':
        return {
          ...previousState,
          isSignedIn: true,
          accessToken: 'TODO',
          idToken: 'TODO',
        }
      case 'USER_INFO':
        return {
          ...previousState,
          userInfo: { /* TODO */ },
        }
      case 'SIGN_OUT':
        return {
          initialState,
        }
    }
  }, initialState);

  const authContext = useMemo(
    () => ({
      state: authState,
      signIn: () => {
        dispatch({ type: "SIGN_IN" })
      },
      signOut: () => {
        dispatch({ type: "SIGN_OUT" })
      },
    }),
    [authState]
  );
  
  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider }