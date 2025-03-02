import React, { useEffect, useState } from 'react';
import { fetchStudentById, fetchStudents, removeStudent } from '../apis/studentApi';

const Management = () => {

  const [ student, setStudent ] = useState([]);
  const [ inputValue, setInputValue ] = useState('');

  useEffect(() => {
    fetchStudents().then(setStudent).catch(console.error)
  }, [])

  console.log(student);

  const deleteStudent = (studentId) => {
    removeStudent(studentId).then(() => {setStudent(student.filter(user => user.id !== studentId))}).catch(console.error);
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === "") {
      fetchStudents().then(setStudent).catch(console.error);
    } else {
      fetchStudents().then((students) => {
        const filteredStudents = students.filter(user =>
          user.id.includes(inputValue) || 
          user.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setStudent(filteredStudents);
      }).catch(console.error);
    }
  }

  return (
    <div className='p-4'>
      <form className="flex justify-between" onSubmit={handleSubmit}>
        <h1>Students List</h1>
        <div className="">
          <input type="text" className='border' value={inputValue} onChange={handleChange} />
          <button type='submit'>S</button>
        </div>
      </form>
      <table className='border-collapse border border-gray-400 w-full'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border border-gray-400 p-2'>Student ID</th>
            <th className='border border-gray-400 p-2'>Name</th>
            <th className='border border-gray-400 p-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {student.map((user) => {
            return(
              <tr key={user.id}>
                <td className='border border-gray-400 p-2'>{ user.id }</td>
                <td className='border border-gray-400 p-2'>{ user.name }</td>
                <td className='border border-gray-400 p-2'>
                    <button>Edit</button>
                    <button onClick={() => deleteStudent(user.id)}>Delete</button>
                  </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Management;
