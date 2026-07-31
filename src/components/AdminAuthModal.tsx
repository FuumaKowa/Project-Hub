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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.1] shadow-2xl overflow-hidden transition-all duration-200 ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Header */}
        <div className="border-b border-black/[0.08] bg-[#f2f2f7]/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0071e3] text-white rounded-xl flex items-center justify-center font-bold">
              {isChangeMode ? <KeyRound className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
                {isChangeMode ? 'Change Admin PIN' : 'Admin Security Access'}
              </h3>
              <p className="text-[11px] text-[#86868b]">
                {isChangeMode ? 'Update your passcode' : 'Passcode required for Admin Manager'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#86868b] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">
              {isChangeMode ? 'Current Admin PIN' : 'Enter Admin Passcode / PIN'}
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: 8888)"
                autoFocus
                className="w-full px-4 py-3 bg-[#f2f2f7] border border-black/[0.08] focus:border-[#0071e3] rounded-2xl text-base text-[#1d1d1f] placeholder-[#86868b] tracking-widest focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] p-1"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isChangeMode && (
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">
                New Admin Passcode / PIN
              </label>
              <input
                type="password"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Enter new PIN (min 4 chars)"
                className="w-full px-4 py-3 bg-[#f2f2f7] border border-black/[0.08] focus:border-[#0071e3] rounded-2xl text-base text-[#1d1d1f] placeholder-[#86868b] tracking-widest focus:outline-none transition-all"
              />
            </div>
          )}

          {/* Keypad Quick Input */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="py-2.5 bg-[#f2f2f7] hover:bg-[#e5e5ea] active:bg-[#d1d1d6] text-sm font-semibold text-[#1d1d1f] rounded-xl transition-colors cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Secret URL Shortcut Hint Toggle */}
          {!isChangeMode && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] text-[#0071e3] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How to bypass PIN with secret link?</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3 bg-[#f2f2f7] rounded-2xl border border-black/[0.08] text-[11px] text-[#515154] space-y-1">
                  <p className="text-[#1d1d1f] font-semibold">Secret Direct Link Access:</p>
                  <p>You can bypass this prompt directly by adding your PIN to the URL:</p>
                  <code className="block p-1.5 bg-white border border-black/[0.08] rounded-xl text-[#0071e3] break-all select-all font-mono">
                    {window.location.origin}?pin={storedPin}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-black/[0.08] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#515154] hover:text-[#1d1d1f] bg-[#f2f2f7] hover:bg-[#e5e5ea] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
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
