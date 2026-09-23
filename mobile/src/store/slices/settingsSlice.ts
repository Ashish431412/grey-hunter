import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  vpnConfig: { enabled: boolean; server: string | null };
  securitySettings: { requireBiometricForTools: boolean; lockOnBackground: boolean };
  syncConfig: { autoSync: boolean; syncOnWifiOnly: boolean };
  themePreference: 'dark' | 'light' | 'system';
}

const initialState: SettingsState = {
  vpnConfig: { enabled: false, server: null },
  securitySettings: { requireBiometricForTools: true, lockOnBackground: true },
  syncConfig: { autoSync: true, syncOnWifiOnly: true },
  themePreference: 'dark', // Native to Grey Hunter
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateVpnConfig: (state, action: PayloadAction<Partial<SettingsState['vpnConfig']>>) => {
      state.vpnConfig = { ...state.vpnConfig, ...action.payload };
    },
    updateSecuritySettings: (state, action: PayloadAction<Partial<SettingsState['securitySettings']>>) => {
      state.securitySettings = { ...state.securitySettings, ...action.payload };
    },
    updateSyncConfig: (state, action: PayloadAction<Partial<SettingsState['syncConfig']>>) => {
      state.syncConfig = { ...state.syncConfig, ...action.payload };
    },
    setThemePreference: (state, action: PayloadAction<SettingsState['themePreference']>) => {
      state.themePreference = action.payload;
    },
  },
});

export const { updateVpnConfig, updateSecuritySettings, updateSyncConfig, setThemePreference } = settingsSlice.actions;
export default settingsSlice.reducer;
