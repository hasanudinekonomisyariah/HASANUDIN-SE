
import React, { useState } from 'react';
import type { Teacher, AttendanceRecord } from '../types';
import { UserPlusIcon, EditIcon, TrashIcon, LogInIcon, LogOutIcon } from './icons';

interface TeacherListProps {
  teachers: Teacher[];
  attendanceRecords: AttendanceRecord[];
  onAddTeacher: (name: string) => void;
  onDeleteTeacher: (id: string) => void;
  onEditTeacher: (teacher: Teacher) => void;
  onClockIn: (teacherId: string) => void;
  onClockOut: (teacherId: string) => void;
}

const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  attendanceRecords,
  onAddTeacher,
  onDeleteTeacher,
  onEditTeacher,
  onClockIn,
  onClockOut,
}) => {
  const [newTeacherName, setNewTeacherName] = useState('');

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeacherName.trim()) {
      onAddTeacher(newTeacherName.trim());
      setNewTeacherName('');
    }
  };

  const isClockedIn = (teacherId: string) => {
    return attendanceRecords.some(
      (record) => record.teacherId === teacherId && !record.clockOut
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Daftar Guru</h2>
      <form onSubmit={handleAddTeacher} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTeacherName}
          onChange={(e) => setNewTeacherName(e.target.value)}
          placeholder="Nama Guru Baru"
          className="flex-grow px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 transition"
        />
        <button
          type="submit"
          title="Tambah Guru"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition font-semibold"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </form>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {teachers.length === 0 ? (
           <p className="text-center text-slate-500 py-8">Belum ada data guru. Silakan tambahkan guru baru.</p>
        ) : (
        teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 gap-3"
          >
            <span className="font-medium text-slate-700 truncate min-w-0">{teacher.name}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isClockedIn(teacher.id) ? (
                <button
                  onClick={() => onClockOut(teacher.id)}
                  className="flex items-center justify-center gap-1.5 w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-semibold"
                  title="Clock Out"
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              ) : (
                <button
                  onClick={() => onClockIn(teacher.id)}
                  className="flex items-center justify-center gap-1.5 w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm font-semibold"
                  title="Clock In"
                >
                  <LogInIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Masuk</span>
                </button>
              )}
              <button
                onClick={() => onEditTeacher(teacher)}
                className="p-2 text-slate-600 hover:bg-yellow-100 hover:text-yellow-600 rounded-full transition"
                title="Edit Nama"
              >
                <EditIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDeleteTeacher(teacher.id)}
                className="p-2 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-full transition"
                title="Hapus Guru"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default TeacherList;
