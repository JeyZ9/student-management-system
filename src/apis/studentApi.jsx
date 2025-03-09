import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8080/api/v1",
    headers: { 'Content-Type': 'application/json'},
});

export const fetchStudents = async () => {
    const response = await api.get('students');
    return response.data;
}
export const searchStudents = async (keyword, page, size) => {
    const response = await api.get(`/students/search?keyword=${keyword}&page=${page}&size=${size}`);
    console.log("Response Data: ", response.data);
    console.log("Students:", response.data.students);

    return response.data;
}

export const fetchStudentById = async (studentId) => {
    const response = await api.get(`/students/${studentId}`);
    return response.data;
}

export const addStudent = async (studentData) => {
    const response = await api.post('/students/create', studentData);
    return response.data
}

export const updateStudent = async (studentId, studentData) => {
    const response = await api.put(`/students/update/${studentId}`, studentData);
    return response.data
}

export const removeStudent = async (studentId) => {
    const response = await api.delete(`/students/delete/${studentId}`);
    return response.data
}