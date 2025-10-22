import React, { useState, useEffect } from 'react';
import type { Teacher, AttendanceRecord } from './types';
import Header from './components/Header';
import TeacherList from './components/TeacherList';
import AttendanceReport from './components/AttendanceReport';
import EditTeacherModal from './components/EditTeacherModal';
import FingerprintScanner from './components/FingerprintScanner';
import PasswordModal from './components/PasswordModal';
import KioskClock from './components/KioskClock';

const App: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendanceRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [view, setView] = useState<'kiosk' | 'admin'>('kiosk');
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);
  
  const handleAddTeacher = (name: string) => {
    const newTeacher: Teacher = { id: `teacher_${Date.now()}`, name };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus guru ini? Semua data absensinya juga akan dihapus.')) {
        setTeachers(prev => prev.filter(t => t.id !== id));
        setAttendanceRecords(prev => prev.filter(rec => rec.teacherId !== id));
    }
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
  };

  const handleCloseEditModal = () => {
    setEditingTeacher(null);
  };

  const handleUpdateTeacher = (id: string, newName: string) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, name: newName } : t));
    setAttendanceRecords(prev => prev.map(rec => rec.teacherId === id ? { ...rec, teacherName: newName } : rec));
    handleCloseEditModal();
  };

  const handleClockIn = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        clockIn: new Date().toISOString()
    };
    setAttendanceRecords(prev => [...prev, newRecord]);
  };
  
  const handleClockOut = (teacherId: string) => {
    setAttendanceRecords(prev => prev.map(rec => {
        if (rec.teacherId === teacherId && !rec.clockOut) {
            return { ...rec, clockOut: new Date().toISOString() };
        }
        return rec;
    }));
  };

  const handleViewChangeRequest = (targetView: 'kiosk' | 'admin') => {
    if (targetView === 'admin') {
      setIsPasswordModalOpen(true);
    } else {
      setView('kiosk');
    }
  };

  const handlePasswordSubmit = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setView('admin');
      setIsPasswordModalOpen(false);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      <Header view={view} onViewChangeRequest={handleViewChangeRequest} />
      <main className="p-4 sm:p-6 lg:p-8">
        {view === 'admin' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <TeacherList 
              teachers={teachers}
              attendanceRecords={attendanceRecords}
              onAddTeacher={handleAddTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onEditTeacher={handleOpenEditModal}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
            <AttendanceReport records={attendanceRecords} />
          </div>
        ) : (
          <>
            <KioskClock />
            <FingerprintScanner
              teachers={teachers}
              // FIX: Pass the missing `attendanceRecords` prop to the FingerprintScanner component, as it is required by its props interface.
              attendanceRecords={attendanceRecords}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          </>
        )}
      </main>
      {isPasswordModalOpen && (
        <PasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
      <EditTeacherModal 
        teacher={editingTeacher}
        onClose={handleCloseEditModal}
        onSave={handleUpdateTeacher}
      />
    </div>
  );
};

export default App;