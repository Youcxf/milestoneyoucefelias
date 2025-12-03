import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import type { DepartmentResponseModel, DepartmentRequestModel, ProfessorResponseModel } from "../../models/models";
import GradientText from "../GradientText";

type Mode = "create" | "edit";
const ROWS_PER_PAGE = 5;

const emptyDepartment: DepartmentRequestModel = {
  departmentName: "",
  departmentBuilding: 0,
};

interface DepartmentWithProfessors extends DepartmentResponseModel {
  professors?: ProfessorResponseModel[];
}

export default function Department() {
  const letters = "Department".split("");
  const [departments, setDepartments] = useState<DepartmentWithProfessors[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DepartmentRequestModel>(emptyDepartment);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDepartmentId, setExpandedDepartmentId] = useState<number | null>(null);
  const [loadingProfessors, setLoadingProfessors] = useState<number | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet("/departments");
      setDepartments(data as DepartmentWithProfessors[]);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProfessorsForDepartment(departmentId: number) {
    try {
      setLoadingProfessors(departmentId);
      const data = await apiGet(`/departments/${departmentId}/professors`);
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === departmentId
            ? { ...d, professors: data.professors || [] }
            : d
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load professors.");
    } finally {
      setLoadingProfessors(null);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentBuilding" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveDepartment().catch((err) => {
      console.error(err);
      setError("Failed to save department.");
    });
  }

  async function saveDepartment() {
    setError(null);
    if (formMode === "create") {
      const created = await apiPost("/departments", formData);
      setDepartments((prev) => [...prev, created as DepartmentWithProfessors]);
    } else if (formMode === "edit" && editingId != null) {
      const updated = await apiPut(`/departments/${editingId}`, formData);
      setDepartments((prev) =>
        prev.map((d) => (d.id === editingId ? (updated as DepartmentWithProfessors) : d))
      );
    }
    resetForm();
  }

  function resetForm() {
    setFormData(emptyDepartment);
    setFormMode("create");
    setEditingId(null);
  }

  function handleEdit(department: DepartmentWithProfessors) {
    setFormMode("edit");
    setEditingId(department.id);
    setFormData({
      departmentName: department.departmentName,
      departmentBuilding: department.departmentBuilding,
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      setError(null);
      await apiDelete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete department.");
    }
  }

  function toggleExpandDepartment(departmentId: number) {
    if (expandedDepartmentId === departmentId) {
      setExpandedDepartmentId(null);
    } else {
      setExpandedDepartmentId(departmentId);
      const dept = departments.find((d) => d.id === departmentId);
      if (dept && !dept.professors) {
        loadProfessorsForDepartment(departmentId);
      }
    }
  }

  // Filter and paginate departments
  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDepartments.length / ROWS_PER_PAGE);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const endIdx = startIdx + ROWS_PER_PAGE;
  const paginatedDepartments = filteredDepartments.slice(startIdx, endIdx);

  return (
    <>
    
      <div className="w-full bg-black flex flex-col text-center pt-25">
        <h2 id="department" className="text-amber-50 text-7xl font-bold">
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
      colors={["#b940ffff", "#c940ffff", "#ffffffff", "#ffffffff", "#4340ffff"]}
      animationSpeed={6}
      showBorder={false}
      className="custom-class"
>
     <p>Find the building and the teachers of a department</p>
       </GradientText>
        
      </div>

      <section className="bg-black text-white p-10">
        <div className="section">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading && <p>Loading departments...</p>}
        </div>

        {/* Search */}
        <div className="section mt-10 mb-6">
          <input
            type="text"
            placeholder="Search departments by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
          />
        </div>

        {/* Departments list */}
        <div className="section mt-10">
          <h2 className="text-3xl font-bold mb-6">Current Departments</h2>
          {filteredDepartments.length === 0 ? (
            <p className="text-gray-400">No departments found. Add one below!</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-500">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-500 p-2">ID</th>
                    <th className="border border-gray-500 p-2">Department Name</th>
                    <th className="border border-gray-500 p-2">Building</th>
                    <th className="border border-gray-500 p-2">Teachers</th>
                    <th className="border border-gray-500 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDepartments.map((department) => (
                    <>
                      <tr key={department.id} className="hover:bg-gray-900">
                        <td className="border border-gray-500 p-2">{department.id}</td>
                        <td className="border border-gray-500 p-2">{department.departmentName}</td>
                        <td className="border border-gray-500 p-2">{department.departmentBuilding}</td>
                        <td className="border border-gray-500 p-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                            onClick={() => toggleExpandDepartment(department.id)}
                          >
                            {expandedDepartmentId === department.id ? "Hide" : "Show"} Teachers
                          </button>
                        </td>
                        <td className="border border-gray-500 p-2">
                          <button
                            className="bg-white hover:bg-blue-700 text-black px-3 py-1 rounded mr-2"
                            onClick={() => handleEdit(department)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-950 hover:bg-red-900 text-white px-3 py-1 rounded"
                            onClick={() => handleDelete(department.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedDepartmentId === department.id && (
                        <tr key={`expand-${department.id}`} className="bg-gray-900">
                          <td colSpan={5} className="border border-gray-500 p-4">
                            {loadingProfessors === department.id ? (
                              <p>Loading teachers...</p>
                            ) : department.professors && department.professors.length > 0 ? (
                              <div>
                                <h4 className="font-bold mb-3">Teachers in {department.departmentName}:</h4>
                                <table className="w-full border-collapse border border-gray-600">
                                  <thead>
                                    <tr className="bg-gray-800">
                                      <th className="border border-gray-600 p-2 text-left">ID</th>
                                      <th className="border border-gray-600 p-2 text-left">Name</th>
                                      <th className="border border-gray-600 p-2 text-left">Email</th>
                                      <th className="border border-gray-600 p-2 text-left">Phone</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {department.professors.map((prof) => (
                                      <tr key={prof.id} className="hover:bg-gray-800">
                                        <td className="border border-gray-600 p-2">{prof.id}</td>
                                        <td className="border border-gray-600 p-2">{prof.professorName}</td>
                                        <td className="border border-gray-600 p-2">{prof.email}</td>
                                        <td className="border border-gray-600 p-2">{prof.professorPhoneNumber}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-gray-400">No teachers in this department.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
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
            {formMode === "create" ? "Add New Department" : "Edit Department"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="departmentName"
                placeholder="Department Name"
                value={formData.departmentName}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <input
                type="number"
                name="departmentBuilding"
                placeholder="Building Number"
                value={formData.departmentBuilding}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {formMode === "create" ? "Add Department" : "Update Department"}
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
      </section>
    </>
  );
}