import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, KeyRound, Eye, EyeOff, AlertCircle, X, Check, HelpCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  storedPin: string;
  onUpdatePin?: (newPin: string) => void;
  isChangeMode?: boolean;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  storedPin,
  onUpdatePin,
  isChangeMode = false,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setNewPinInput('');
      setErrorMsg('');
      setShake(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (isChangeMode) {
      if (pinInput !== storedPin) {
        triggerError('Current PIN is incorrect');
        return;
      }
      if (!newPinInput || newPinInput.trim().length < 4) {
        triggerError('New PIN must be at least 4 characters');
        return;
      }
      if (onUpdatePin) {
        onUpdatePin(newPinInput.trim());
      }
      onSuccess();
      onClose();
      return;
    }

    if (pinInput.trim() === storedPin) {
      // Save authenticated state in sessionStorage
      sessionStorage.setItem('admin_authenticated', 'true');
      onSuccess();
      onClose();
    } else {
      triggerError('Incorrect Admin Passcode/PIN');
    }
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'DEL') {
      setPinInput((prev) => prev.slice(0, -1));
    } else if (val === 'CLR') {
      setPinInput('');
    } else {
      setPinInput((prev) => (prev.length < 12 ? prev + val : prev));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md bg-[#0d0d0d] border-2 border-neutral-800 shadow-2xl overflow-hidden transition-all duration-200 ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Header */}
        <div className="border-b border-neutral-800 bg-[#121212] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-rose-600 border border-rose-400 text-white flex items-center justify-center font-bold">
              {isChangeMode ? <KeyRound className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                {isChangeMode ? 'Change Admin PIN' : 'Admin Security Access'}
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">
                {isChangeMode ? 'Update your passcode' : 'Passcode required for Admin Manager'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2">
              {isChangeMode ? 'Current Admin PIN' : 'Enter Admin Passcode / PIN'}
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: 8888)"
                autoFocus
                className="w-full px-4 py-3 bg-[#171717] border-2 border-neutral-800 focus:border-rose-500 text-base font-mono text-white placeholder-neutral-600 tracking-widest focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-1"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isChangeMode && (
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2">
                New Admin Passcode / PIN
              </label>
              <input
                type="password"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Enter new PIN (min 4 chars)"
                className="w-full px-4 py-3 bg-[#171717] border-2 border-neutral-800 focus:border-rose-500 text-base font-mono text-white placeholder-neutral-600 tracking-widest focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Keypad Quick Input */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="py-2.5 bg-[#141414] hover:bg-[#202020] active:bg-rose-900/40 text-sm font-mono font-bold text-neutral-200 border border-neutral-800 transition-colors cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Secret URL Shortcut Hint Toggle */}
          {!isChangeMode && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How to bypass PIN with secret link?</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3 bg-[#141414] border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
                  <p className="text-neutral-200 font-bold">Secret Direct Link Access:</p>
                  <p>You can bypass this prompt directly by adding your PIN to the URL:</p>
                  <code className="block p-1.5 bg-black border border-neutral-800 text-rose-400 break-all select-all font-mono">
                    {window.location.origin}?pin={storedPin}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-white bg-[#181818] border border-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 flex items-center space-x-2 transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
            >
              <Check className="w-4 h-4" />
              <span>{isChangeMode ? 'Save New PIN' : 'Unlock Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
