
export interface Teacher {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  clockIn: string; // ISO 8601 string format
  clockOut?: string; // ISO 8601 string format
}
