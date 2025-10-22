
import React from 'react';
import type { AttendanceRecord } from '../types';
import { FileDownIcon } from './icons';

// Fix: Declare jspdf and XLSX on the window object to resolve TypeScript errors.
// These libraries are likely included via script tags in the HTML file.
declare global {
  interface Window {
    jspdf: any;
    XLSX: any;
  }
}

interface AttendanceReportProps {
  records: AttendanceRecord[];
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({ records }) => {

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };
  
  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return '-';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    if (duration < 0) return 'Invalid';
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours} jam ${minutes} mnt`;
  };
  
  const sortedRecords = [...records].sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());

  const downloadPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Laporan Absensi Guru - SD Negeri 2 Pongo", 14, 15);
    doc.autoTable({
        startY: 20,
        head: [['Nama Guru', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Durasi']],
        body: sortedRecords.map(rec => [
            rec.teacherName,
            formatDate(rec.clockIn),
            formatTime(rec.clockIn),
            formatTime(rec.clockOut),
            calculateDuration(rec.clockIn, rec.clockOut)
        ]),
    });

    doc.save('laporan_absensi.pdf');
  };

  const downloadExcel = () => {
    const worksheet = window.XLSX.utils.json_to_sheet(
        sortedRecords.map(rec => ({
            "Nama Guru": rec.teacherName,
            "Tanggal": formatDate(rec.clockIn),
            "Jam Masuk": formatTime(rec.clockIn),
            "Jam Keluar": formatTime(rec.clockOut),
            "Durasi": calculateDuration(rec.clockIn, rec.clockOut)
        }))
    );
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi");
    window.XLSX.writeFile(workbook, "laporan_absensi.xlsx");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Laporan Absensi</h2>
        <div className="flex gap-2">
            <button onClick={downloadPDF} title="Unduh PDF" className="flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:px-3 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-semibold">
                <FileDownIcon className="w-4 h-4"/>
                <span className="hidden sm:inline">PDF</span>
            </button>
            <button onClick={downloadExcel} title="Unduh Excel" className="flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:px-3 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-semibold">
                <FileDownIcon className="w-4 h-4"/>
                <span className="hidden sm:inline">Excel</span>
            </button>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[65vh]">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">Nama Guru</th>
              <th scope="col" className="px-4 py-3">Tanggal</th>
              <th scope="col" className="px-4 py-3">Jam Masuk</th>
              <th scope="col" className="px-4 py-3">Jam Keluar</th>
              <th scope="col" className="px-4 py-3">Durasi</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center text-slate-500 py-8">Belum ada data absensi.</td>
                </tr>
            ) : (
            sortedRecords.map(record => (
              <tr key={record.id} className="bg-white border-b hover:bg-sky-50">
                <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{record.teacherName}</td>
                <td className="px-4 py-3">{formatDate(record.clockIn)}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">{formatTime(record.clockIn)}</td>
                <td className="px-4 py-3 text-red-600 font-semibold">{formatTime(record.clockOut)}</td>
                <td className="px-4 py-3">{calculateDuration(record.clockIn, record.clockOut)}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;
