import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8080/api/v1",
    headers: { 'Content-Type': 'application/json'},
});

export const fetchStudents = async () => {
    const response = await api.get('student');
    return response.data;
}

export const fetchStudentById = async (studentId) => {
    const response = await api.get(`student/${studentId}`);
    return response.data;
}

export const addStudent = async (studentData) => {
    const response = await api.post('student', studentData);
    return response.data
}

export const updateStudent = async (studentData) => {
    const response = await api.put('student', studentData);
    return response.data
}

export const removeStudent = async (studentId) => {
    const response = await api.delete(`student/${studentId}`);
    return response.data
}