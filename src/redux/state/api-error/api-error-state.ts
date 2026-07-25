import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IApiErrorEvent {
  id: number;
  endpointName: string;
  message: string;
}

export interface IApiErrorState {
  lastError: IApiErrorEvent | null;
}

const initialState: IApiErrorState = {
  lastError: null,
};

const apiErrorSlice = createSlice({
  name: 'apiErrorSlice',
  initialState,
  reducers: {
    apiErrorOccurred: {
      prepare: ({ endpointName, message }: { endpointName: string; message: string }) => ({
        payload: { id: Date.now(), endpointName, message },
      }),
      reducer: (state, action: PayloadAction<IApiErrorEvent>) => {
        state.lastError = action.payload;
      },
    },
    apiErrorCleared: state => {
      state.lastError = null;
    },
  },

  selectors: {
    selectLastApiError: state => state.lastError,
  },
});

export const { apiErrorOccurred, apiErrorCleared } = apiErrorSlice.actions;
export const { selectLastApiError } = apiErrorSlice.selectors;
export default apiErrorSlice.reducer;
