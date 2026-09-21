import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// NOTE: Retrieve any stored token from sessionStorage on startup.
// By checking for the token first, we only set isLoading to true if there is an
// active session token to verify. If there is no token (e.g. first visit or logged-out state),
// isLoading starts as false so the login page can load immediately without waiting on a backend call.
let storedToken = null;
try {
  const rawToken = sessionStorage.getItem("token");
  storedToken = rawToken ? JSON.parse(rawToken) : null;
} catch (error) {
  console.error("Error reading token from sessionStorage:", error);
  storedToken = null;
}

const initialState = {
  isAuthenticated: false,
  isLoading: !!storedToken, // Only true if a token actually exists to verify
  user: null,
  token: storedToken,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);


export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);


export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async() => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);


// export const checkAuth = createAsyncThunk(
//   "/auth/checkauth",

//   async () => {
//     const response = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
//       {
//         withCredentials: true,
//         headers: {
//           "Cache-Control":
//             "no-store, no-cache, must-revalidate, proxy-revalidate",
//         },
//       }
//     );

//     return response.data;
//   }
// );

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async (token) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
      {
        headers: {
          Authorization : `Bearer ${token}`,
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);


const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        setUser : (state,action) => {},
        resetTokenAndCredentials : (state) => {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          // NOTE: Ensure loading is disabled when credentials are reset (e.g. on logout)
          state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        }) 
        .addCase(loginUser.fulfilled, (state, action) => {
          console.log(action)
          state.isLoading = false;
          state.user = action.payload.success ? action.payload.user : null; 
          state.isAuthenticated = action.payload.success;
          state.token = action.payload.token
          sessionStorage.setItem('token', JSON.stringify(action.payload.token))
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
          state.token = null
        })
        .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.success ? action.payload.user : null;
          state.isAuthenticated = action.payload.success;
        })
        .addCase(checkAuth.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(logoutUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
      });
    },
    }
)


export const {setUser, resetTokenAndCredentials} = authSlice.actions;
export default authSlice.reducer;