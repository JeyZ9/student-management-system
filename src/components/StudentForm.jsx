import React, { useEffect, useState } from 'react';
import { fetchStudentById, addStudent, updateStudent } from '../apis/studentApi';
import { IoCloseOutline } from "react-icons/io5";

const StudentForm = (props) => {
    const [student, setStudent] = useState(null);
    const [formData, setFormData] = useState({ id: '', name: '' });
    const [loading, setLoading] = useState(true);
    const { studentId, handleOpenPopup } = props;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (studentId) {
            updateStudent(studentId, formData)
                .then((data) => {
                    console.log('Updated Student:', data);
                    setStudent(data);
                })
                .catch(console.error);
                handleOpenPopup()
        } else {
            addStudent(formData)
                .then((data) => {
                    console.log('Created New Student:', data);
                    setStudent(data);
                })
                .catch(console.error);
                handleOpenPopup()
        }
    }

    useEffect(() => {
        if (studentId) {
            setLoading(true);
            fetchStudentById(studentId)
                .then((data) => {
                    setStudent(data);
                    setFormData({ id: data.id, name: data.name });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching student:", error);
                    setLoading(false);
                });
        } else {
            setFormData({ id: '', name: '' });
            setLoading(false);
        }
    }, [studentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className='bg-white p-10 rounded-md text-gray-500 shadow-lg text-base'>
            <div key={studentId} className='flex flex-col gap-5 justify-between'>
                <div className="flex justify-between">
                    <h1 className='text-xl font-semibold text-gray-600'>{studentId ? 'Edit Student' : 'Create Student'}</h1>
                    <button type="button" onClick={handleOpenPopup} className='text-xl hover:text-red-500 ease-in-out delay-200 duration-200'>{ <IoCloseOutline /> }</button>
                </div>
                <div className="flex flex-col gap-4">
                    {/* id */}
                    <label htmlFor="">
                        <p>Student ID</p>
                        <input
                            type="text"
                            value={formData.id}
                            className="border w-[20rem] px-2 py-1"
                            onChange={handleChange}
                            name="id"
                            readOnly={!!studentId} 
                            required
                        />
                    </label>
                    {/* name */}
                    <label htmlFor="">
                        <p>Student Name</p>
                        <input
                            type="text"
                            value={formData.name}
                            className="border w-[20rem] px-2 py-1"
                            onChange={handleChange}
                            name="name"
                            required
                        />
                    </label>
                </div>
                <button type="submit" className='bg-green-500 text-white font-semibold rounded-sm py-1'>
                    {studentId ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default StudentForm;
