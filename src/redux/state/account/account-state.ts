import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAccountDataResponse, IUserQuestTag, IUserPreferences } from '@/contract/account/account';

interface IUserState {
  name: string | null;
  surname: string | null;
  nickname: string | null;
  email: string | null;
  avatar: string | null;
  data: {
    questsLabels: IUserQuestTag[];
  };
  preferences: IUserPreferences;
}

const initialState: IUserState = {
  name: null,
  surname: null,
  nickname: null,
  email: null,
  avatar: null,
  data: {
    questsLabels: [],
  },
  preferences: {},
};

const accountSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IAccountDataResponse>) => {
      const { name, surname, nickname, email, avatar, data, preferences } = action.payload;

      state.name = name;
      state.surname = surname;
      state.nickname = nickname;
      state.email = email;
      state.avatar = avatar;
      state.data = data;
      state.preferences = preferences;
    },
  },
  selectors: {
    selectUserData: state => state,
    selectUserName: state => state.name,
    selectUserSurname: state => state.surname,
    selectUserNickname: state => state.nickname,
    selectUserEmail: state => state.email,
    selectUserAvatar: state => state.avatar,
    selectUserTags: state => state.data.questsLabels,
    selectUserPreferences: state => state.preferences,
    selectIsUserDataLoaded: state => state.name !== null,
  },
});

export const { setUserData } = accountSlice.actions;
export const { selectUserTags, selectUserData } = accountSlice.selectors;

export default accountSlice.reducer;
