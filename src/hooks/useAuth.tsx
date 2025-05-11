import React, { createContext, useMemo, useReducer, useEffect, useContext } from 'react';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

// 
WebBrowser.maybeCompleteAuthSession();

//
type UserInfo = {
  username: string;
  givenName: string;
  familyName: string;
  email: string;
}

type AuthState = {
  isSignedIn: boolean;
  accessToken?: string | null;
  idToken?: string | null;
  userInfo?: UserInfo | null;
}

type AuthContextType = {
  state: AuthState;
  signIn: () => void,
  signOut: () => void
}

type Action =
  | { type: 'SIGN_IN', payload: { access_token: string, id_token: string } }
  | { type: 'USER_INFO', payload: { preferred_username: string, given_name: string, family_name: string, email: string } }
  | { type: 'SIGN_OUT' }

const initialState: AuthState = {
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  userInfo: null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (previousState: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...previousState,
        isSignedIn: true,
        accessToken: action.payload.access_token,
        idToken: action.payload.id_token
      }
    case 'USER_INFO':
      return {
        ...previousState,
        userInfo: {
          username: action.payload.preferred_username,
          givenName: action.payload.given_name,
          familyName: action.payload.family_name,
          email: action.payload.email
        }
      }
    case 'SIGN_OUT':
      return initialState;
  }
}

const redirectUri = makeRedirectUri({
  preferLocalhost: false,
  // TODO: Acontece algo que vez em quando preciso mudar
  // alguma coisas nesse metódo para o modal com a página
  // ser aberto
  native: "rnexpooauth://redirect"
})

const getToken = async ({ code, codeVerifier, redirectUri }: any) => {
  try {
    const formData: any = {
      grant_type: 'authorization_code',
      client_id: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
      code: code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    }
    const formBody = []
    for (const property in formData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(formData[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.join('&'),
      }
    )
    if (response.ok) {
      return await response.json()
    }
  } catch (e) {
    console.warn(e);
  }
}

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const discovery = useAutoDiscovery(process.env.EXPO_PUBLIC_KEYCLOAK_URL);
  const [request, result, promptAsync] = useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
    redirectUri,
    scopes: ['openid', 'profile']
  }, discovery);

  // effect: load session by SecureStore
  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const idToken = await SecureStore.getItemAsync('idToken');
      if (accessToken && idToken) {
        dispatch({ type: 'SIGN_IN', payload: { access_token: accessToken, id_token: idToken } });
      }
    };

    restoreSession();
  }, []);

  // effect: load user info
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + state.accessToken,
              Accept: 'application/json'
            }
          }
        )
        if (response.ok) {
          const payload = await response.json();
          dispatch({ type: 'USER_INFO', payload });
        }
      } catch (err) {
        console.warn(err);
      }
    }

    if (state.isSignedIn) {
      getUserInfo();
    }
  }, [state.accessToken, state.isSignedIn, dispatch]);


  const signIn = async () => {
    try {
      const response = await promptAsync();
      if (response.type === "success") {
        const token = await getToken({
          code: response.params.code,
          codeVerifier: request?.codeVerifier,
          redirectUri
        })

        if (token?.access_token && token?.id_token) {
          dispatch({ type: 'SIGN_IN', payload: token });

          // Save tokens in SecureStore to restore session
          await SecureStore.setItemAsync('accessToken', token.access_token);
          await SecureStore.setItemAsync('idToken', token.id_token);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const signOut = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?id_token_hint=${state.idToken}`)
      dispatch({ type: 'SIGN_OUT' });

      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('idToken');
    } catch (err) {
      console.warn(err);
    }
  }

  const value = useMemo(() => ({
    state,
    signIn,
    signOut
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}