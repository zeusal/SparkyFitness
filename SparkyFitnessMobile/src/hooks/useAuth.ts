import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import {
  setOnSessionExpired,
  setOnNoConfigs,
  setOnIdentityChanged,
  suppressSessionExpired,
} from '../services/api/authService';
import { clearServerConfigCache } from '../services/storage';
import type { ServerConfig } from '../services/storage';
import { addLog } from '../services/LogService';

export type AuthModalReason = 'session_expired' | 'no_configs' | null;

export function useAuth() {
  const queryClient = useQueryClient();
  const [authModalReason, setAuthModalReason] = useState<AuthModalReason>(null);
  const [expiredConfigId, setExpiredConfigId] = useState<string | null>(null);
  const [switchToApiKeyConfig, setSwitchToApiKeyConfig] =
    useState<ServerConfig | null>(null);

  useEffect(() => {
    setOnSessionExpired((configId) => {
      setSwitchToApiKeyConfig(null);
      setExpiredConfigId(configId);
      setAuthModalReason((prev) => {
        if (!prev) {
          clearServerConfigCache();
          suppressSessionExpired(true);
        }
        return 'session_expired';
      });
    });
    setOnNoConfigs(() => {
      setSwitchToApiKeyConfig(null);
      setAuthModalReason('no_configs');
    });
    // Everything cached under the previous account has to go, or the new one
    // reads it until each query happens to refetch.
    setOnIdentityChanged(() => {
      queryClient.clear();
      // The image caches go too, but for data at rest rather than for what the
      // next account can see: every server-backed image URI carries a uuid --
      // `check-in-photos/file/{uuid}` and `/uploads/{domain}/{id}/{uuid}-name`
      // -- so the new account cannot request a path that resolves to the
      // previous one's bytes. What it can do is leave a departed account's
      // progress photos sitting in the app's disk cache indefinitely, which is
      // why this is deliberately not awaited: nothing on screen depends on it,
      // and blocking a sign-in on a disk sweep would buy nothing. A failure is
      // logged rather than swallowed, since it leaves those files behind.
      void Image.clearMemoryCache().catch((err: unknown) => {
        addLog(`Failed to clear the image memory cache: ${err}`, 'WARNING');
      });
      void Image.clearDiskCache().catch((err: unknown) => {
        addLog(`Failed to clear the image disk cache: ${err}`, 'WARNING');
      });
    });
  }, [queryClient]);

  const dismissModal = useCallback(() => {
    setAuthModalReason(null);
    setExpiredConfigId(null);
    setSwitchToApiKeyConfig(null);
    suppressSessionExpired(false);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setAuthModalReason(null);
    setExpiredConfigId(null);
    setSwitchToApiKeyConfig(null);
    suppressSessionExpired(false);
  }, []);

  // Transition from ReauthModal to ServerConfigModal in API key mode.
  // Keeps suppressSessionExpired(true) active so 401s don't re-trigger
  // the reauth modal while the user is entering an API key.
  const handleSwitchToApiKey = useCallback((config: ServerConfig) => {
    setAuthModalReason(null);
    setExpiredConfigId(null);
    setSwitchToApiKeyConfig(config);
  }, []);

  const handleSwitchToApiKeyDone = useCallback(() => {
    setSwitchToApiKeyConfig(null);
    suppressSessionExpired(false);
  }, []);

  return {
    authModalReason,
    showReauthModal: authModalReason === 'session_expired',
    showSetupModal: authModalReason === 'no_configs',
    showApiKeySwitchModal: switchToApiKeyConfig !== null,
    expiredConfigId,
    switchToApiKeyConfig,
    dismissModal,
    handleLoginSuccess,
    handleSwitchToApiKey,
    handleSwitchToApiKeyDone,
  };
}
