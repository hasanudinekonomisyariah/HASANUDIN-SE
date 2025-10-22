import React, { useState } from 'react';
import { LockIcon } from './icons';

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onSubmit(password);
    if (!success) {
      setError('Password salah. Silakan coba lagi.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4 transform transition-all scale-100">
        <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-sky-100 rounded-full mb-3">
                <LockIcon className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Admin</h2>
            <p className="text-slate-500 mb-6">Masukkan password untuk melanjutkan.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(''); // Clear error on type
            }}
            className={`w-full px-4 py-2 border rounded-md transition focus:ring-2 focus:border-sky-500 ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-sky-500'}`}
            placeholder="Password"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
          <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors font-semibold"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors font-semibold"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
