import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Bus, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Route,
  CalendarDays,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import './AdminRoutes.css';

const AdminRoutes = ({ onLogout }) => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [approvedBuses, setApprovedBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Form state
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    status: 'ACTIVE'
  });

  // Bus assignment state
  const [assignmentData, setAssignmentData] = useState({
    busId: '',
    departureDate: '',
    departureTime: '',
    assignedSeats: 0
  });

  // Edit assignment state
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showEditAssignmentModal, setShowEditAssignmentModal] = useState(false);

  useEffect(() => {
    checkAdminAuth();
    fetchRoutes();
    fetchApprovedBuses();
  }, []);

  const checkAdminAuth = () => {
    try {
      const userData = localStorage.getItem('user');
      const userType = localStorage.getItem('userType');
      
      if (!userData || userType !== 'ADMIN') {
        console.log('🚫 No admin authentication found, redirecting to login');
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('💥 Authentication check failed:', error);
      navigate('/login');
    }
  };

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/routes');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform backend data to match frontend format
          const transformedRoutes = data.data.map(route => ({
            id: route.id,
            from: route.fromLocation,
            to: route.toLocation,
            departureTime: route.departureTime,
            arrivalTime: route.arrivalTime,
            price: route.ticketPrice,
            status: route.status,
            busAssignments: route.routeAssignments ? route.routeAssignments.map(assignment => ({
              id: assignment.id,
              busId: assignment.busId,
              busName: assignment.busName,
              busCapacity: assignment.busCapacity,
              departureDate: assignment.departureDate,
              departureTime: assignment.departureTime,
              assignedSeats: assignment.assignedSeats,
              status: assignment.status
            })) : []
          }));
          setRoutes(transformedRoutes);
        } else {
          console.error('Failed to fetch routes:', data.message);
          // Fallback to empty array
          setRoutes([]);
        }
      } else {
        console.error('Failed to fetch routes:', response.status);
        // Fallback to empty array
        setRoutes([]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      // Fallback to empty array
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedBuses = async () => {
    try {
      // Fetch approved buses from backend
      const response = await fetch('http://localhost:8081/api/buses?status=APPROVED');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApprovedBuses(data.data);
        } else {
          // Fallback to dummy data
          const dummyBuses = [
            {
              id: 1,
              busName: 'Express Deluxe',
              registrationNumber: 'ABC-1234',
              seatingCapacity: 45,
              ownerName: 'Nisal Amarasekara',
              status: 'APPROVED'
            },
            {
              id: 2,
              busName: 'Comfort Plus',
              registrationNumber: 'XYZ-5678',
              seatingCapacity: 50,
              ownerName: 'John Doe',
              status: 'APPROVED'
            },
            {
              id: 3,
              busName: 'Luxury Coach',
              registrationNumber: 'DEF-9012',
              seatingCapacity: 40,
              ownerName: 'Jane Smith',
              status: 'APPROVED'
            }
          ];
          setApprovedBuses(dummyBuses);
        }
      } else {
        // Fallback to dummy data
        const dummyBuses = [
          {
            id: 1,
            busName: 'Express Deluxe',
            registrationNumber: 'ABC-1234',
            seatingCapacity: 45,
            ownerName: 'Nisal Amarasekara',
            status: 'APPROVED'
          },
          {
            id: 2,
            busName: 'Comfort Plus',
            registrationNumber: 'XYZ-5678',
            seatingCapacity: 50,
            ownerName: 'John Doe',
            status: 'APPROVED'
          },
          {
            id: 3,
            busName: 'Luxury Coach',
            registrationNumber: 'DEF-9012',
            seatingCapacity: 40,
            ownerName: 'Jane Smith',
            status: 'APPROVED'
          }
        ];
        setApprovedBuses(dummyBuses);
      }
    } catch (error) {
      console.error('Error fetching approved buses:', error);
      // Fallback to dummy data
      const dummyBuses = [
        {
          id: 1,
          busName: 'Express Deluxe',
          registrationNumber: 'ABC-1234',
          seatingCapacity: 45,
          ownerName: 'Nisal Amarasekara',
          status: 'APPROVED'
        },
        {
          id: 2,
          busName: 'Comfort Plus',
          registrationNumber: 'XYZ-5678',
          seatingCapacity: 50,
          ownerName: 'John Doe',
          status: 'APPROVED'
        },
        {
          id: 3,
          busName: 'Luxury Coach',
          registrationNumber: 'DEF-9012',
          seatingCapacity: 40,
          ownerName: 'Jane Smith',
          status: 'APPROVED'
        }
      ];
      setApprovedBuses(dummyBuses);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({
      ...prev,
      [name]: value
    }));

    // If bus is selected, update assigned seats
    if (name === 'busId') {
      const selectedBus = approvedBuses.find(bus => bus.id === parseInt(value));
      if (selectedBus) {
        setAssignmentData(prev => ({
          ...prev,
          assignedSeats: selectedBus.seatingCapacity
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.from.trim() || !formData.to.trim()) {
      alert('Please fill in both From and To fields');
      return;
    }

    try {
      const routeData = {
        fromLocation: formData.from,
        toLocation: formData.to,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        ticketPrice: parseFloat(formData.price),
        status: formData.status,
        description: ''
      };

      if (editingRoute) {
        // Update existing route
        const response = await fetch(`http://localhost:8081/api/routes/${editingRoute.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routeData)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Refresh routes from backend
            await fetchRoutes();
            setEditingRoute(null);
            setShowAddModal(false);
            resetForm();
            alert('Route updated successfully!');
          } else {
            alert('Failed to update route: ' + data.message);
          }
        } else {
          alert('Failed to update route');
        }
      } else {
        // Add new route
        const response = await fetch('http://localhost:8081/api/routes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routeData)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Refresh routes from backend
            await fetchRoutes();
            setShowAddModal(false);
            resetForm();
            alert('Route created successfully!');
          } else {
            alert('Failed to create route: ' + data.message);
          }
        } else {
          alert('Failed to create route');
        }
      }
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Failed to save route');
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!assignmentData.busId || !assignmentData.departureDate || !assignmentData.departureTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const assignmentDataToSend = {
        routeId: selectedRoute.id,
        busId: parseInt(assignmentData.busId),
        departureDate: assignmentData.departureDate,
        departureTime: assignmentData.departureTime,
        assignedSeats: assignmentData.assignedSeats
      };

      const response = await fetch(`http://localhost:8081/api/routes/${selectedRoute.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentDataToSend)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh routes from backend
          await fetchRoutes();
          setShowAssignmentModal(false);
          resetAssignmentForm();
          alert('Bus assigned successfully!');
        } else {
          alert('Failed to assign bus: ' + data.message);
        }
      } else {
        alert('Failed to assign bus to route');
      }
    } catch (error) {
      console.error('Error assigning bus:', error);
      alert('Failed to assign bus');
    }
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    
    if (!assignmentData.busId || !assignmentData.departureDate || !assignmentData.departureTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // First remove the old assignment
      const removeResponse = await fetch(`http://localhost:8081/api/routes/assignments/${editingAssignment.id}`, {
        method: 'DELETE'
      });

      if (removeResponse.ok) {
        // Then create the new assignment
        const assignmentDataToSend = {
          routeId: selectedRoute.id,
          busId: parseInt(assignmentData.busId),
          departureDate: assignmentData.departureDate,
          departureTime: assignmentData.departureTime,
          assignedSeats: assignmentData.assignedSeats
        };

        const createResponse = await fetch(`http://localhost:8081/api/routes/${selectedRoute.id}/assign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assignmentDataToSend)
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          if (data.success) {
            // Refresh routes from backend
            await fetchRoutes();
            setShowEditAssignmentModal(false);
            setEditingAssignment(null);
            resetAssignmentForm();
            alert('Bus assignment updated successfully!');
          } else {
            alert('Failed to update assignment: ' + data.message);
          }
        } else {
          alert('Failed to update bus assignment');
        }
      } else {
        alert('Failed to remove old assignment');
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Failed to update assignment');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      from: route.from,
      to: route.to,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      price: route.price,
      status: route.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/routes/${routeId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Refresh routes from backend
            await fetchRoutes();
            alert('Route deleted successfully!');
          } else {
            alert('Failed to delete route: ' + data.message);
          }
        } else {
          alert('Failed to delete route');
        }
      } catch (error) {
        console.error('Error deleting route:', error);
        alert('Failed to delete route');
      }
    }
  };

  const handleAssignBus = (route) => {
    setSelectedRoute(route);
    setShowAssignmentModal(true);
  };

  const handleEditAssignment = (route, assignment) => {
    setSelectedRoute(route);
    setEditingAssignment(assignment);
    setAssignmentData({
      busId: assignment.busId.toString(),
      departureDate: assignment.departureDate,
      departureTime: assignment.departureTime,
      assignedSeats: assignment.assignedSeats
    });
    setShowEditAssignmentModal(true);
  };

  const handleRemoveAssignment = async (routeId, assignmentId) => {
    if (window.confirm('Are you sure you want to remove this bus assignment?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/routes/assignments/${assignmentId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Refresh routes from backend
            await fetchRoutes();
            alert('Bus assignment removed successfully!');
          } else {
            alert('Failed to remove assignment: ' + data.message);
          }
        } else {
          alert('Failed to remove bus assignment');
        }
      } catch (error) {
        console.error('Error removing assignment:', error);
        alert('Failed to remove bus assignment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      status: 'ACTIVE'
    });
  };

  const resetAssignmentForm = () => {
    setAssignmentData({
      busId: '',
      departureDate: '',
      departureTime: '',
      assignedSeats: 0
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRoute(null);
    resetForm();
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedRoute(null);
    resetAssignmentForm();
  };

  const closeEditAssignmentModal = () => {
    setShowEditAssignmentModal(false);
    setEditingAssignment(null);
    setSelectedRoute(null);
    resetAssignmentForm();
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-red-600 bg-red-100';
      case 'MAINTENANCE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAssignmentStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'text-blue-600 bg-blue-100';
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get available buses (not assigned to any route)
  const getAvailableBuses = (departureDate, departureTime) => {
    // Get all bus IDs that are already assigned to any route
    const assignedBusIds = routes.flatMap(route => 
      route.busAssignments.map(assignment => assignment.busId)
    );
    
    // Filter out buses that are already assigned to any route
    return approvedBuses.filter(bus => !assignedBusIds.includes(bus.id));
  };

  if (loading) {
    return (
      <div className="admin-routes-container">
        <Navbar onLogout={onLogout} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading routes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-routes-container">
      <Navbar onLogout={onLogout} />
      
      <div className="admin-routes-content">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-info">
            <div className="admin-avatar">
              <Route size={40} />
            </div>
            <div className="admin-details">
              <h1>Route Management</h1>
              <div className="admin-meta">
                <span className="last-login">
                  {routes.length} active routes
                </span>
                <div className="security-status">
                  <MapPin size={20} className="security-icon high" />
                  <span>Route Control Center</span>
                </div>
              </div>
            </div>
          </div>
          <div className="admin-actions">
            <button 
              className="btn-primary" 
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={20} />
              Add New Route
            </button>
                         <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>
               Back to Dashboard
             </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search routes by From or To..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="routes-section">
          <h2>Bus Routes</h2>
          
          {filteredRoutes.length === 0 ? (
            <div className="empty-state">
              <Route size={64} className="empty-icon" />
              <h3>No Routes Found</h3>
              <p>No routes match your search criteria.</p>
            </div>
          ) : (
            <div className="routes-grid">
              {filteredRoutes.map((route) => (
                <div key={route.id} className="route-card">
                  <div className="route-header">
                    <div className="route-icon">
                      <MapPin size={24} />
                    </div>
                    <div className="route-info">
                      <h3>{route.from} → {route.to}</h3>
                      <p className="route-time">
                        {route.departureTime} - {route.arrivalTime}
                      </p>
                    </div>
                    <div className={`status-badge ${getStatusColor(route.status)}`}>
                      <span>{route.status}</span>
                    </div>
                  </div>
                  
                  <div className="route-details">
                    <div className="detail-item">
                      <Bus size={16} />
                      <span><strong>Buses:</strong> {route.busAssignments.length}</span>
                    </div>
                    <div className="detail-item">
                      <span className="price">LKR {route.price}</span>
                    </div>
                  </div>

                  {/* Bus Assignments */}
                  {route.busAssignments.length > 0 && (
                    <div className="bus-assignments">
                      <h4>Assigned Buses:</h4>
                                             {route.busAssignments.map((assignment) => (
                         <div key={assignment.id} className="assignment-item">
                           <div className="assignment-info">
                             <span className="bus-name">{assignment.busName}</span>
                             <span className="assignment-date">
                               {new Date(assignment.departureDate).toLocaleDateString()} at {assignment.departureTime}
                             </span>
                             <span className="seats-info">
                               {assignment.assignedSeats}/{assignment.busCapacity} seats
                             </span>
                           </div>
                           <div className="assignment-actions">
                             <button
                               className="btn-edit"
                               onClick={() => handleEditAssignment(route, assignment)}
                               title="Edit Assignment"
                             >
                               <Edit size={14} />
                             </button>
                             <button
                               className="btn-remove"
                               onClick={() => handleRemoveAssignment(route.id, assignment.id)}
                               title="Remove Assignment"
                             >
                               <Trash2 size={14} />
                             </button>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}
                  
                  <div className="route-actions">
                    <button
                      className="btn-assign"
                      onClick={() => handleAssignBus(route)}
                    >
                      <Bus size={16} />
                      Assign Bus
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(route)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(route.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Route Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingRoute ? 'Edit Route' : 'Add New Route'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="from">From *</label>
                  <div className="input-with-icon">
                    <MapPin size={16} />
                    <input
                      type="text"
                      id="from"
                      name="from"
                      value={formData.from}
                      onChange={handleInputChange}
                      placeholder="Enter departure city"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="to">To *</label>
                  <div className="input-with-icon">
                    <MapPin size={16} />
                    <input
                      type="text"
                      id="to"
                      name="to"
                      value={formData.to}
                      onChange={handleInputChange}
                      placeholder="Enter destination city"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departureTime">Departure Time</label>
                  <input
                    type="time"
                    id="departureTime"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="arrivalTime">Arrival Time</label>
                  <input
                    type="time"
                    id="arrivalTime"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Ticket Price (LKR)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="1200"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </form>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={closeModal}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSubmit}
              >
                {editingRoute ? 'Update Route' : 'Add Route'}
              </button>
            </div>
          </div>
        </div>
      )}

             {/* Bus Assignment Modal */}
       {showAssignmentModal && (
         <div className="modal-overlay">
           <div className="modal-content">
             <div className="modal-header">
               <h3>Assign Bus to Route</h3>
               <button className="modal-close" onClick={closeAssignmentModal}>×</button>
             </div>
             <form onSubmit={handleAssignmentSubmit} className="modal-body">
               <div className="assignment-info">
                 <h4>{selectedRoute?.from} → {selectedRoute?.to}</h4>
                 <p>Route Time: {selectedRoute?.departureTime} - {selectedRoute?.arrivalTime}</p>
               </div>
               
               <div className="form-group">
                 <label htmlFor="busId">Select Bus *</label>
                 <select
                   id="busId"
                   name="busId"
                   value={assignmentData.busId}
                   onChange={handleAssignmentChange}
                   required
                 >
                   <option value="">Choose a bus...</option>
                   {getAvailableBuses(assignmentData.departureDate, assignmentData.departureTime).map(bus => (
                     <option key={bus.id} value={bus.id}>
                       {bus.busName} ({bus.registrationNumber}) - {bus.seatingCapacity} seats
                     </option>
                   ))}
                 </select>
                 {assignmentData.busId && (
                   <div className="bus-details">
                     <p><strong>Owner:</strong> {approvedBuses.find(b => b.id === parseInt(assignmentData.busId))?.ownerName}</p>
                     <p><strong>Capacity:</strong> {assignmentData.assignedSeats} seats</p>
                   </div>
                 )}
               </div>
               
               <div className="form-row">
                 <div className="form-group">
                   <label htmlFor="departureDate">Departure Date *</label>
                   <input
                     type="date"
                     id="departureDate"
                     name="departureDate"
                     value={assignmentData.departureDate}
                     onChange={handleAssignmentChange}
                     required
                     min={new Date().toISOString().split('T')[0]}
                   />
                 </div>
                 <div className="form-group">
                   <label htmlFor="departureTime">Departure Time *</label>
                   <input
                     type="time"
                     id="departureTime"
                     name="departureTime"
                     value={assignmentData.departureTime}
                     onChange={handleAssignmentChange}
                     required
                   />
                 </div>
               </div>

               <div className="assignment-warning">
                 <AlertTriangle size={16} />
                 <span>Note: A bus cannot be assigned to multiple routes at the same time and date.</span>
               </div>
             </form>
             <div className="modal-footer">
               <button 
                 className="btn-secondary" 
                 onClick={closeAssignmentModal}
               >
                 Cancel
               </button>
               <button 
                 className="btn-primary"
                 onClick={handleAssignmentSubmit}
                 disabled={!assignmentData.busId || !assignmentData.departureDate || !assignmentData.departureTime}
               >
                 Assign Bus
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Edit Assignment Modal */}
       {showEditAssignmentModal && (
         <div className="modal-overlay">
           <div className="modal-content">
             <div className="modal-header">
               <h3>Edit Bus Assignment</h3>
               <button className="modal-close" onClick={closeEditAssignmentModal}>×</button>
             </div>
             <form onSubmit={handleUpdateAssignment} className="modal-body">
               <div className="assignment-info">
                 <h4>{selectedRoute?.from} → {selectedRoute?.to}</h4>
                 <p>Route Time: {selectedRoute?.departureTime} - {selectedRoute?.arrivalTime}</p>
                 <p className="current-assignment">
                   <strong>Current Assignment:</strong> {editingAssignment?.busName} 
                   ({editingAssignment?.departureDate} at {editingAssignment?.departureTime})
                 </p>
               </div>
               
               <div className="form-group">
                 <label htmlFor="editBusId">Select Bus *</label>
                 <select
                   id="editBusId"
                   name="busId"
                   value={assignmentData.busId}
                   onChange={handleAssignmentChange}
                   required
                 >
                   <option value="">Choose a bus...</option>
                   {approvedBuses.map(bus => (
                     <option key={bus.id} value={bus.id}>
                       {bus.busName} ({bus.registrationNumber}) - {bus.seatingCapacity} seats
                     </option>
                   ))}
                 </select>
                 {assignmentData.busId && (
                   <div className="bus-details">
                     <p><strong>Owner:</strong> {approvedBuses.find(b => b.id === parseInt(assignmentData.busId))?.ownerName}</p>
                     <p><strong>Capacity:</strong> {assignmentData.assignedSeats} seats</p>
                   </div>
                 )}
               </div>
               
               <div className="form-row">
                 <div className="form-group">
                   <label htmlFor="editDepartureDate">Departure Date *</label>
                   <input
                     type="date"
                     id="editDepartureDate"
                     name="departureDate"
                     value={assignmentData.departureDate}
                     onChange={handleAssignmentChange}
                     required
                     min={new Date().toISOString().split('T')[0]}
                   />
                 </div>
                 <div className="form-group">
                   <label htmlFor="editDepartureTime">Departure Time *</label>
                   <input
                     type="time"
                     id="editDepartureTime"
                     name="departureTime"
                     value={assignmentData.departureTime}
                     onChange={handleAssignmentChange}
                     required
                   />
                 </div>
               </div>

               <div className="assignment-warning">
                 <AlertTriangle size={16} />
                 <span>Note: A bus cannot be assigned to multiple routes at the same time and date.</span>
               </div>
             </form>
             <div className="modal-footer">
               <button 
                 className="btn-secondary" 
                 onClick={closeEditAssignmentModal}
               >
                 Cancel
               </button>
               <button 
                 className="btn-primary"
                 onClick={handleUpdateAssignment}
                 disabled={!assignmentData.busId || !assignmentData.departureDate || !assignmentData.departureTime}
               >
                 Update Assignment
               </button>
             </div>
           </div>
         </div>
       )}

      <Footer />
    </div>
  );
};

export default AdminRoutes;
