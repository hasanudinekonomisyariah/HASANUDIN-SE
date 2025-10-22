
import React, { useState, useEffect } from 'react';
import type { Teacher } from '../types';

interface EditTeacherModalProps {
  teacher: Teacher | null;
  onClose: () => void;
  onSave: (id: string, newName: string) => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ teacher, onClose, onSave }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
    }
  }, [teacher]);

  if (!teacher) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(teacher.id, name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Edit Nama Guru</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Nama Guru"
            autoFocus
          />
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors font-semibold"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
