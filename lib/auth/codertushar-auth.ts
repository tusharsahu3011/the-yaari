'use client';

/**
 * CoderTushar.in SSO & Player Account Service for The Yaari
 * Integrates directly with CoderTushar's user database and /api/games endpoints.
 */

export interface CoderTusharUser {
  id: string;
  username: string;
  displayName: string;
  email?: string | null;
  avatar: string;
  role?: string;
  isGuest: boolean;
  joinedAt?: string;
}

export interface CoderTusharStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  civilianWins: number;
  undercoverWins: number;
  mrWhiteBluffs: number;
  rating?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: CoderTusharUser;
  stats: CoderTusharStats;
  isLoading: boolean;
}

const STORAGE_KEY = 'theyaari_auth_session';
const GUEST_ID_KEY = 'theyaari_guest_id';

// Determine CoderTushar API base URL depending on environment
export function getCoderTusharBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://codertushar.in';
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://codertushar.in';
}

function generateDefaultGuest(): CoderTusharUser {
  let savedName = 'Yaar_9410';
  let savedAvatar = '/assets/bhabhi/avatar-you.png';

  if (typeof window !== 'undefined') {
    try {
      const n =
        localStorage.getItem('theyaari_player_name') || localStorage.getItem('gameshub_player_name');
      if (n) savedName = n;
      const a =
        localStorage.getItem('theyaari_player_avatar') || localStorage.getItem('gameshub_player_avatar');
      if (a) savedAvatar = a;
    } catch {}
  }

  let guestId = 'guest_1001';
  if (typeof window !== 'undefined') {
    try {
      const storedId = localStorage.getItem(GUEST_ID_KEY);
      if (storedId) {
        guestId = storedId;
      } else {
        guestId = `guest_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
        localStorage.setItem(GUEST_ID_KEY, guestId);
      }
    } catch {}
  }

  return {
    id: guestId,
    username: savedName,
    displayName: savedName,
    email: null,
    avatar: savedAvatar,
    role: 'GUEST',
    isGuest: true,
    joinedAt: new Date().toISOString(),
  };
}

const DEFAULT_STATS: CoderTusharStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  civilianWins: 0,
  undercoverWins: 0,
  mrWhiteBluffs: 0,
  rating: 1200,
};

type AuthListener = (state: AuthState) => void;

class CoderTusharAuthService {
  private state: AuthState = {
    isAuthenticated: false,
    user: generateDefaultGuest(),
    stats: DEFAULT_STATS,
    isLoading: true,
  };

  private listeners: Set<AuthListener> = new Set();
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public getState(): AuthState {
    return this.state;
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.state));
  }

  /**
   * Initialize session by checking local storage cache first,
   * then verifying live session with codertushar.in API
   */
  public async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    // Load cached session if available
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        this.state = {
          ...this.state,
          isAuthenticated: parsed.isAuthenticated ?? false,
          user: parsed.user || generateDefaultGuest(),
          stats: parsed.stats || DEFAULT_STATS,
          isLoading: false,
        };
        this.notify();
      }
    } catch {}

    // Verify live session with codertushar.in
    await this.checkLiveSession();
  }

  public async checkLiveSession(): Promise<boolean> {
    try {
      const baseUrl = getCoderTusharBaseUrl();
      const res = await fetch(`${baseUrl}/api/games/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Pass cookies across codertushar.in and subdomains
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          const user: CoderTusharUser = {
            id: data.user.id,
            username: data.user.username || data.user.displayName,
            displayName: data.user.displayName || data.user.username,
            email: data.user.email,
            avatar: data.user.avatar || '/assets/bhabhi/avatar-you.png',
            role: data.user.role || 'USER',
            isGuest: false,
            joinedAt: data.user.joinedAt,
          };

          const stats: CoderTusharStats = {
            gamesPlayed: data.stats?.gamesPlayed || 0,
            wins: data.stats?.wins || 0,
            losses: data.stats?.losses || 0,
            winRate: data.stats?.winRate || 0,
            civilianWins: data.stats?.civilianWins || 0,
            undercoverWins: data.stats?.undercoverWins || 0,
            mrWhiteBluffs: data.stats?.mrWhiteBluffs || 0,
            rating: data.stats?.eloRating || 1200,
          };

          this.state = {
            isAuthenticated: true,
            user,
            stats,
            isLoading: false,
          };

          this.saveCache();
          this.syncLocalPlayer(user.displayName, user.avatar);
          this.notify();
          return true;
        }
      }
    } catch {
      // Offline, network error, or codertushar server not running
    }

    // Fallback to guest if not authenticated
    if (!this.state.isAuthenticated) {
      this.state = {
        ...this.state,
        isAuthenticated: false,
        user: generateDefaultGuest(),
        isLoading: false,
      };
      this.notify();
    }
    return false;
  }

  /**
   * Redirect user to codertushar.in sign-in page with return callback URL
   */
  public loginWithCoderTushar(customCallbackUrl?: string): void {
    if (typeof window === 'undefined') return;
    const baseUrl = getCoderTusharBaseUrl();
    const currentUrl = customCallbackUrl || window.location.href;
    const redirectUrl = `${baseUrl}/login?callbackUrl=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  }

  /**
   * Redirect user to codertushar.in registration page
   */
  public signupWithCoderTushar(customCallbackUrl?: string): void {
    if (typeof window === 'undefined') return;
    const baseUrl = getCoderTusharBaseUrl();
    const currentUrl = customCallbackUrl || window.location.href;
    const redirectUrl = `${baseUrl}/signup?callbackUrl=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  }

  /**
   * Log out from session
   */
  public logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    this.state = {
      isAuthenticated: false,
      user: generateDefaultGuest(),
      stats: DEFAULT_STATS,
      isLoading: false,
    };
    this.notify();
  }

  /**
   * Update Guest display name or avatar locally
   */
  public updateGuestProfile(name: string, avatar?: string): void {
    const cleanName = name.trim() || 'Yaar';
    const newAvatar = avatar || this.state.user.avatar;

    const updatedUser: CoderTusharUser = {
      ...this.state.user,
      username: cleanName,
      displayName: cleanName,
      avatar: newAvatar,
    };

    this.state = {
      ...this.state,
      user: updatedUser,
    };

    this.saveCache();
    this.syncLocalPlayer(cleanName, newAvatar);
    this.notify();
  }

  /**
   * Record match outcome and sync to CoderTushar if authenticated
   */
  public async recordGameResult(params: {
    gameId: string;
    hasWon: boolean;
    role?: 'civilian' | 'undercover' | 'mrwhite';
  }): Promise<void> {
    const currentStats = this.state.stats;
    const newGamesPlayed = currentStats.gamesPlayed + 1;
    const newWins = currentStats.wins + (params.hasWon ? 1 : 0);
    const newLosses = currentStats.losses + (params.hasWon ? 0 : 1);
    const newWinRate = Math.round((newWins / newGamesPlayed) * 100);

    const updatedStats: CoderTusharStats = {
      ...currentStats,
      gamesPlayed: newGamesPlayed,
      wins: newWins,
      losses: newLosses,
      winRate: newWinRate,
      civilianWins:
        currentStats.civilianWins + (params.role === 'civilian' && params.hasWon ? 1 : 0),
      undercoverWins:
        currentStats.undercoverWins + (params.role === 'undercover' && params.hasWon ? 1 : 0),
      mrWhiteBluffs:
        currentStats.mrWhiteBluffs + (params.role === 'mrwhite' && params.hasWon ? 1 : 0),
    };

    this.state = {
      ...this.state,
      stats: updatedStats,
    };
    this.saveCache();
    this.notify();

    // If signed into codertushar, sync to backend
    if (this.state.isAuthenticated) {
      try {
        const baseUrl = getCoderTusharBaseUrl();
        await fetch(`${baseUrl}/api/games/stats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            gameId: params.gameId,
            won: params.hasWon,
            role: params.role,
          }),
        });
      } catch {}
    }
  }

  private saveCache() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isAuthenticated: this.state.isAuthenticated,
          user: this.state.user,
          stats: this.state.stats,
        })
      );
    } catch {}
  }

  private syncLocalPlayer(name: string, avatar: string) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('theyaari_player_name', name);
      localStorage.setItem('gameshub_player_name', name);
      localStorage.setItem('theyaari_player_avatar', avatar);
    } catch {}
  }
}

export const coderTusharAuth = new CoderTusharAuthService();
