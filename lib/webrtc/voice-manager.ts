'use client';

export interface VoiceState {
  isSupported: boolean;
  isJoined: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  hasPermissionError: boolean;
  errorMessage?: string;
}

export class VoiceMeshManager {
  private localStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private checkSpeakingInterval: NodeJS.Timeout | null = null;
  private isMuted: boolean = false;
  private isSpeaking: boolean = false;
  private onSpeakingCallback?: (speaking: boolean) => void;
  private onErrorCallback?: (error: string) => void;

  public async startMicrophone(
    onSpeaking: (speaking: boolean) => void,
    onError: (error: string) => void
  ): Promise<boolean> {
    this.onSpeakingCallback = onSpeaking;
    this.onErrorCallback = onError;

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      onError('WebRTC Voice is not supported in this browser.');
      return false;
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Set up volume analyzer for speaking indicator
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(this.localStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);

        this.startSpeakingDetection();
      }

      return true;
    } catch (err: any) {
      let msg = 'Microphone permission was denied or device not found.';
      if (err.name === 'NotAllowedError') {
        msg = 'Microphone access blocked. Please allow mic permissions in your browser.';
      }
      onError(msg);
      return false;
    }
  }

  private startSpeakingDetection() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.checkSpeakingInterval = setInterval(() => {
      if (this.isMuted || !this.analyser) {
        if (this.isSpeaking) {
          this.isSpeaking = false;
          this.onSpeakingCallback?.(false);
        }
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;

      // Threshold for voice activity
      const speaking = average > 25;
      if (speaking !== this.isSpeaking) {
        this.isSpeaking = speaking;
        this.onSpeakingCallback?.(speaking);
      }
    }, 120);
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  public stop() {
    if (this.checkSpeakingInterval) {
      clearInterval(this.checkSpeakingInterval);
      this.checkSpeakingInterval = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isSpeaking = false;
  }
}

