import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LeaderboardState {
  data: any; // replace 'any' with the type of your leaderboard data
  refresh: boolean;
}

const initialState: LeaderboardState = {
  data: null,
  refresh: false,
};

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLeaderboardData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    refreshLeaderboard: (state) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { setLeaderboardData, refreshLeaderboard } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;