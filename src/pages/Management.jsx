import React, { useCallback, useEffect, useState } from "react";
import {
  searchStudents,
  removeStudent,
} from "../apis/studentApi";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearch, IoPersonAdd  } from "react-icons/io5";
import { z } from "zod";
import StudentForm from "../components/StudentForm";

const Management = () => {
  const [ student, setStudent ] = useState([]);
  const [ inputValue, setInputValue ] = useState("");
  const [controls, setControls] = useState({ page: 0, size: 10, total: 0 });
  const [ studentId, setStudentId ] = useState("");
  const [ openPopup, setOpenPopup ] = useState(false);

  // const handleSendStudentId = (studentId) => {
  //   setStudentId(studentId);
  // }

  const controlsSchema = z.object({
    page: z.number().min(0),
    size: z.number().min(1).max(10),
    total: z.number().min(0)
  })

  const controllers = {
    get: controls,
    set: (state, value ) => 
      setControls((prev) => ({ ...prev, [state]: value}))
  }

  const validateControls = () => {
    try{
      controlsSchema.parse(controls);
    } catch(error){
      if(error instanceof z.ZodError){
        console.log("Validation Error: ", error.errors);
      }
    }
  }

  // const handleSubmit = useCallback((e) => {
  //   e.preventDefault();
  // }, []);

  const handleOpenPopup = () => {
    setOpenPopup(!openPopup);
  }

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    searchStudents(inputValue, controllers.get.page, controllers.get.size)
      .then((data) => {
        setStudent(data.students);
        controllers.set("total", data.total);
      })
      .catch(console.error);
    
    // setInputValue("");
  }, [inputValue, controllers.get.page, controllers.get.size]);

  useEffect(() => {
    validateControls();
    searchStudents("", controllers.get.page, controllers.get.size)
      .then((data) => {
        setStudent(data.students);
        controllers.set("total", data.total);
      })
      .catch(console.error);
  }, [controllers.get.page, controllers.get.size])

  // useEffect(() => {
  //   let isMounted = true;
  //   // searchStudents("", controllers.get.page, controllers.get.size)
  //   //   .then((data) => {
  //   //     if (data && Array.isArray(data.students)) {
  //   //       console.log("Log in useEffect", data.students);
  //   //       setStudent(data.students);
  //   //       controllers.set("total", data.total);
  //   //     } else {
  //   //       console.error("No students found in the response:", data);
  //   //       setStudent([]);
  //   //       controllers.set("total", 0);
  //   //     }
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error fetching students:", error);
  //   //     setStudent([]);
  //   //     controllers.set("total", 0);
  //   //   });


  //   // if (inputValue === "") {
  //   //   searchStudents("", controllers.get.page, controllers.get.size)
  //   //     .then((data) => {
  //   //       setStudent(data.students);
  //   //       // controllers.set("total", data.students.length);
  //   //       controllers.set("total", data.total);
  //   //     })
  //   //     .catch(console.error);
  //   // } else {
  //   //   searchStudents(inputValue, controllers.get.page, controllers.get.size)
  //   //     .then((data) => {
  //   //       // const filteredStudents = data.students.filter(
  //   //       //   (user) =>
  //   //       //     user.id.includes(inputValue) ||
  //   //       //     user.name.toLowerCase().includes(inputValue.toLowerCase())
  //   //       // );
  //   //       controllers.set("total", data.total);
  //   //       setStudent(data.students);
  //   //     })
  //   //     .catch(console.error);
  //   // }

  //   const findStudent = async() => {
  //     try{
  //       const data = await searchStudents(inputValue, controllers.get.page, controllers.get.size);
  //       if(isMounted){
  //         setStudent(data.students);
  //         controllers.set("total", data.total);
  //       }
  //     }catch(e){
  //       console.error("Error find Student: ", e);
  //       if(isMounted){
  //         setStudent([]);
  //         controllers.set("total", 0);
  //       }
  //     }
  //   }
  //   findStudent();
  //   return () => {
  //     isMounted = false;
  //   }
  // }, [controllers.get.page, controllers.get.size, inputValue]);
  

  console.log(student);

  const deleteStudent = (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Student has been deleted.",
          icon: "success",
        });
        removeStudent(studentId)
          .then(() => {
            setStudent(student.filter((user) => user.id !== studentId));
          })
          .catch(console.error);
      }
    });
  };

  return (
    <div className="flex flex-col px-96 gap-2 py-14 w-full relative items-center justify-center">
      <form className="flex justify-between w-full" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-gray-600">Students List</h1>
        <div className="h-[30px] flex">
          <input
            type="text"
            className="border h-full rounded-l-sm px-2 outline-green-500/50 text-gray-700"
            value={inputValue}
            onChange={handleChange}
            placeholder="Secrch..."
          />
          <div className="flex justify-between gap-4">
            <button type="submit" className="p-2 h-full bg-green-500 hover:bg-green-600 text-white ease-in-out delay-200 duration-200 rounded-r-sm">{ <IoSearch /> }</button>
            <button type="button" onClick={handleOpenPopup} className="p-2 h-full bg-sky-500 hover:bg-sky-600 text-white ease-in-out delay-200 duration-200 rounded-sm">{ <IoPersonAdd /> }</button>
          </div>
        </div>
      </form>
      {/* <table className='border-collapse border border-gray-400 max-w-full'>
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
                <td className='border border-gray-400 p-2 text-center '>
                    <button className='text-white p-2 bg-yellow-500 rounded-sm hover:bg-yellow-600 ease-in-out delay-200 duration-200 mx-1'>{ <FaRegEdit /> }</button>
                    <button onClick={() => deleteStudent(user.id)} className='text-white p-2 bg-red-500 rounded-sm hover:bg-red-600 ease-in-out delay-200 duration-200 mx-1'>{ <RiDeleteBin5Line /> }</button>
                  </td>
              </tr>
            )
          })}
        </tbody>
      </table> */}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Student ID</th>
              <th className="border border-gray-400 p-2">Name</th>
              <th className="border border-gray-400 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {student.map((user) => {
              return (
                <tr key={user.id}>
                  <td className="border border-gray-400 p-2">{user.id}</td>
                  <td className="border border-gray-400 p-2">{user.name}</td>
                  <td className="border border-gray-400 p-2 text-center ">
                    <button onClick={() => {setStudentId(user.id),handleOpenPopup()}} className="text-white p-2 bg-yellow-500 rounded-sm hover:bg-yellow-600 ease-in-out delay-200 duration-200 mx-1">
                      {<FaRegEdit />}
                    </button>
                    <button
                      onClick={() => deleteStudent(user.id)}
                      className="text-white p-2 bg-red-500 rounded-sm hover:bg-red-600 ease-in-out delay-200 duration-200 mx-1"
                    >
                      {<RiDeleteBin5Line />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing&nbsp;
            <span className="font-semibold text-gray-600">
              {controllers.get.page + 1}
            </span>&nbsp;of&nbsp;
            <span className="font-semibold text-gray-600">
              {Math.ceil(controllers.get.total / controllers.get.size)}
            </span>
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button onClick={() => controllers.set("page", controllers.get.page - 1)} disabled={controllers.get.page <= 0} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
                Previous
              </button>
            </li>

            {[...Array(Math.ceil(controllers.get.total / controllers.get.size))].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => controllers.set('page', index)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    controllers.get.page === index ? 'bg-green-500/50 text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li>
              <button onClick={() => controllers.set("page", controllers.get.page + 1)} disabled={controllers.get.page + 1 >= (Math.ceil(controllers.get.total / controllers.get.size)) || controllers.get.total > 100} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
                Next
              </button>
            </li>
          </ul>
        </nav>

      </div>
      <div className={`absolute ${openPopup ? "" : "hidden" }`}>
        <StudentForm studentId={studentId} handleOpenPopup={handleOpenPopup} />
      </div>
    </div>
  );
};

export default Management;
