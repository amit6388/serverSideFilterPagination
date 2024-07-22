import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FetchDataForm = () => {
  const [formData, setFormData] = useState({
    page: 1,
    limit: 3,
    name: '',
    email: '',
    contact: ''
  });
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLimitChange = (e) => {
    setFormData({
      ...formData,
      limit: Number(e.target.value),
      page: 1, // Reset to the first page when the limit changes
    });
  };

  const fetchData = async (page = formData.page) => {
    const { limit, name, email, contact } = formData;
    const url = `http://localhost:8000/?page=${page}&limit=${limit}&name=${name}&email=${email}&contact=${contact}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      
      setData(result.items);
      setTotalPages(Math.ceil(result.totalItems / limit));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [formData]);

  useEffect(() => {
    fetchData(formData.page);
  }, [formData.page]);

  const handlePageChange = (newPage) => {
    setFormData({
      ...formData,
      page: newPage
    });
  };

  const renderTableData = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">No records found</td>
        </tr>
      );
    }

    return data.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.contact}</td>
      </tr>
    ));
  };

  const renderPagination = () => {
    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${formData.page === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(formData.page - 1)} 
              disabled={formData.page === 1}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li key={i + 1} className={`page-item ${formData.page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${formData.page === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(formData.page + 1)} 
              disabled={formData.page === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container">
      <h2 className="my-4">Fetch Data Form</h2>

      <div className="mt-4">
        <h3>Data Table</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
            </tr>
            <tr>
              <th><input type="text" disabled className="form-control" name="id" value={formData.id} onChange={handleChange} /></th>
              <th><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} /></th>
              <th><input type="text" className="form-control" name="email" value={formData.email} onChange={handleChange} /></th>
              <th><input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} /></th>
            </tr>
          </thead>
          <tbody>
            {renderTableData()}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center">
          <div>{renderPagination()}</div>
          <div className="mt-3">
            <label htmlFor="limitSelect" className="form-label">Items per page:</label>
            <select 
              id="limitSelect" 
              className="form-select" 
              value={formData.limit} 
              onChange={handleLimitChange}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetchDataForm;
