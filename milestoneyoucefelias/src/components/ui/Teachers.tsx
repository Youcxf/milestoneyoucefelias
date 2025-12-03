import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import type { ProfessorResponseModel, ProfessorRequestModel, DepartmentResponseModel } from "../../models/models";
import GradientText from "../GradientText";

type Mode = "create" | "edit";
const ROWS_PER_PAGE = 5;

const emptyTeacher: ProfessorRequestModel = {
  email: "",
  professorName: "",
  professorPhoneNumber: "",
  departmentId: 0,
};

interface TeacherWithDepartment extends ProfessorResponseModel {
  departmentName?: string;
}

export default function Teachers() {
  const letters = "Teachers".split("");
  const [teachers, setTeachers] = useState<TeacherWithDepartment[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProfessorRequestModel>(emptyTeacher);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTeachers();
    loadDepartments();
  }, []);

  async function loadTeachers() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet("/professors");
      setTeachers(data as TeacherWithDepartment[]);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDepartments() {
    try {
      const data = await apiGet("/departments");
      setDepartments(data as DepartmentResponseModel[]);
    } catch (err) {
      console.error(err);
    }
  }

  function getDepartmentName(deptId: number): string {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.departmentName : "Unknown";
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentId" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveTeacher().catch((err) => {
      console.error(err);
      setError("Failed to save teacher.");
    });
  }

  async function saveTeacher() {
    setError(null);
    if (formMode === "create") {
      const created = await apiPost("/professors", formData);
      const teacherWithDept: TeacherWithDepartment = {
        ...created,
        departmentName: getDepartmentName(created.departmentId),
      };
      setTeachers((prev) => [...prev, teacherWithDept]);
    } else if (formMode === "edit" && editingId != null) {
      const updated = await apiPut(`/professors/${editingId}`, formData);
      const teacherWithDept: TeacherWithDepartment = {
        ...updated,
        departmentName: getDepartmentName(updated.departmentId),
      };
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingId ? teacherWithDept : t))
      );
    }
    resetForm();
  }

  function resetForm() {
    setFormData(emptyTeacher);
    setFormMode("create");
    setEditingId(null);
  }

  function handleEdit(teacher: TeacherWithDepartment) {
    setFormMode("edit");
    setEditingId(teacher.id);
    setFormData({
      email: teacher.email,
      professorName: teacher.professorName,
      professorPhoneNumber: teacher.professorPhoneNumber,
      departmentId: teacher.departmentId,
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      setError(null);
      await apiDelete(`/professors/${id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete teacher.");
    }
  }

  // Filter and paginate teachers
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.professorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / ROWS_PER_PAGE);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const endIdx = startIdx + ROWS_PER_PAGE;
  const paginatedTeachers = filteredTeachers.slice(startIdx, endIdx);

  return (
    <>
      <div className="w-full bg-black flex flex-col text-center pt-25">
        <h2 id="teachers" className="text-amber-50 text-7xl font-bold">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: -200, opacity: 0, filter: "blur(20px)" }}
              whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.1,
                delay: i * 0.1,
                type: "spring",
                stiffness: 20,
              }}
              viewport={{ once: true }}
            >
              {letter}
            </motion.span>
          ))}
        </h2>
        <GradientText
          colors={["#405dffff", "#4079ff", "#ffffffff", "#ffffffff", "#a340ffff"]}
          animationSpeed={6}
          showBorder={false}
          className="custom-class"
        >
          <p>Find your teacher's information and department</p>
        </GradientText>
      </div>

      <section className="bg-black text-white p-10">
        <div className="section">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading && <p>Loading teachers...</p>}
        </div>

        {/* Search */}
        <div className="section mt-10 mb-6">
          <input
            type="text"
            placeholder="Search teachers by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
          />
        </div>

        {/* Teachers list */}
        <div className="section mt-10">
          <h2 className="text-3xl font-bold mb-6">Current Teachers</h2>
          {filteredTeachers.length === 0 ? (
            <p className="text-gray-400">No teachers found. Add one below!</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-500">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-500 p-2 text-left">ID</th>
                    <th className="border border-gray-500 p-2 text-left">Name</th>
                    <th className="border border-gray-500 p-2 text-left">Email</th>
                    <th className="border border-gray-500 p-2 text-left">Phone</th>
                    <th className="border border-gray-500 p-2 text-left">Department</th>
                    <th className="border border-gray-500 p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-900">
                      <td className="border border-gray-500 p-2">{teacher.id}</td>
                      <td className="border border-gray-500 p-2">{teacher.professorName}</td>
                      <td className="border border-gray-500 p-2">{teacher.email}</td>
                      <td className="border border-gray-500 p-2">{teacher.professorPhoneNumber}</td>
                      <td className="border border-gray-500 p-2">
                        {getDepartmentName(teacher.departmentId)}
                      </td>
                      <td className="border border-gray-500 p-2">
                        <button
                          className="bg-white hover:bg-blue-700 text-black px-3 py-1 rounded mr-2"
                          onClick={() => handleEdit(teacher)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-950 hover:bg-red-900 text-white px-3 py-1 rounded"
                          onClick={() => handleDelete(teacher.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-purple-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Form */}
        <div className="section mt-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">
            {formMode === "create" ? "Add New Teacher" : "Edit Teacher"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="professorName"
                placeholder="Teacher Name"
                value={formData.professorName}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <input
                type="tel"
                name="professorPhoneNumber"
                placeholder="Phone Number"
                value={formData.professorPhoneNumber}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                <option value={0}>Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-900 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {formMode === "create" ? "Add Teacher" : "Update Teacher"}
              </button>
              {formMode === "edit" && (
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              
              )}
            </div>
          </form>
          </div>
      
        <div className="h-32"></div>
        
      </section>
    </>
  );
}