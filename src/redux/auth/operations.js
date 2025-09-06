const API_PREFIX = "/api";

export const moneyGuardAPI = axios.create({
  baseURL: "https://wallet.b.goit.study",
  withCredentials: false
});

export const registerThunk = createAsyncThunk("user/register", async (body, thunkAPI) => {
  try {
    const { data } = await moneyGuardAPI.post(`${API_PREFIX}/auth/sign-up`, body); // gerekirse sign-up → register yap
    setAuthHeader(data.data.accessToken);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const loginThunk = createAsyncThunk("user/login", async (body, thunkAPI) => {
  try {
    const { data } = await moneyGuardAPI.post(`${API_PREFIX}/auth/sign-in`, body); // gerekirse sign-in → login yap
    setAuthHeader(data.data.accessToken);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const refreshUserThunk = createAsyncThunk("user/refresh", async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  if (!token) return thunkAPI.rejectWithValue("Token is not exist");
  setAuthHeader(token);
  try {
    const { data } = await moneyGuardAPI.get(`${API_PREFIX}/users/current`);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});
