import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Bus, User, Calendar, MapPin, Clock, Eye, Phone } from 'lucide-react';
import './adminapprove.css';

const AdminApprove = ({ onLogout, onClose }) => {
  const [buses, setBuses] = useState([]);
  const [approvedBuses, setApprovedBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

  useEffect(() => {
    fetchBuses();
    fetchApprovedBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/buses/status/PENDING');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log('Backend bus data:', data.data);
          
          // Fetch users data to get phone numbers
          const usersResponse = await fetch('http://localhost:8081/api/users');
          let usersData = [];
          
          if (usersResponse.ok) {
            const usersResult = await usersResponse.json();
            if (usersResult.success && usersResult.data) {
              usersData = usersResult.data;
              console.log('Users data:', usersData);
            }
          }
          
                      // Transform backend data to include phone number and company from users table
            // Only show PENDING buses (hide approved buses)
            const transformedBuses = data.data
              .filter(bus => bus.status === 'PENDING') // Only show pending buses
              .map(bus => {
                console.log('Processing bus:', bus);

                // Find the owner in users table
                const owner = usersData.find(user =>
                  user.id === bus.ownerId ||
                  user.name === bus.ownerName ||
                  user.email === bus.ownerEmail
                );

                const phoneNumber = owner?.phone ||
                                  owner?.phoneNumber ||
                                  bus.ownerPhone ||
                                  bus.phone ||
                                  bus.owner?.phone ||
                                  bus.ownerPhoneNumber ||
                                  'N/A';

                const companyName = owner?.company ||
                                  owner?.companyName ||
                                  bus.companyName ||
                                  bus.company ||
                                  bus.owner?.company ||
                                  bus.owner?.companyName ||
                                  'N/A';

                console.log('Found owner:', owner, 'Phone:', phoneNumber, 'Company:', companyName);

                return {
                  ...bus,
                  ownerPhone: phoneNumber,
                  companyName: companyName
                };
              });
            console.log('Transformed buses (PENDING only):', transformedBuses);
            setBuses(transformedBuses);
        } else {
          // Fallback to dummy data
          setBuses([
            {
              id: 1,
              busName: 'City Express',
              registrationNumber: 'ABC-1234',
              seatingCapacity: 45,
              ownerName: 'John Doe',
              ownerPhone: '+94 77 123 4567',
              companyName: 'City Transport (Pvt) Ltd',
              status: 'PENDING',
              submittedDate: '2024-01-15',
              route: 'Colombo - Kandy',
              features: ['AC', 'WiFi', 'USB Charging']
            },
            {
              id: 2,
              busName: 'Metro Bus',
              registrationNumber: 'XYZ-5678',
              seatingCapacity: 50,
              ownerName: 'Jane Smith',
              ownerPhone: '+94 77 987 6543',
              companyName: 'Metro Lines (Pvt) Ltd',
              status: 'PENDING',
              submittedDate: '2024-01-14',
              route: 'Colombo - Galle',
              features: ['AC', 'WiFi']
            },
            {
              id: 3,
              busName: 'Express Deluxe',
              registrationNumber: 'DEF-9012',
              seatingCapacity: 40,
              ownerName: 'Mike Johnson',
              ownerPhone: '+94 77 555 1234',
              companyName: 'Express Travels (Pvt) Ltd',
              status: 'PENDING',
              submittedDate: '2024-01-13',
              route: 'Colombo - Jaffna',
              features: ['AC', 'WiFi', 'USB Charging', 'Entertainment']
            }
          ]);
        }
      } else {
        // Fallback to dummy data
        setBuses([
          {
            id: 1,
            busName: 'City Express',
            registrationNumber: 'ABC-1234',
            seatingCapacity: 45,
            ownerName: 'John Doe',
            ownerPhone: '+94 77 123 4567',
            companyName: 'City Transport (Pvt) Ltd',
            status: 'PENDING',
            submittedDate: '2024-01-15',
            route: 'Colombo - Kandy',
            features: ['AC', 'WiFi', 'USB Charging']
          },
          {
            id: 2,
            busName: 'Metro Bus',
            registrationNumber: 'XYZ-5678',
            seatingCapacity: 50,
            ownerName: 'Jane Smith',
            ownerPhone: '+94 77 987 6543',
            companyName: 'Metro Lines (Pvt) Ltd',
            status: 'PENDING',
            submittedDate: '2024-01-14',
            route: 'Colombo - Galle',
            features: ['AC', 'WiFi']
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      // Fallback to dummy data
      setBuses([
        {
          id: 1,
          busName: 'City Express',
          registrationNumber: 'ABC-1234',
          seatingCapacity: 45,
          ownerName: 'John Doe',
          ownerPhone: '+94 77 123 4567',
          companyName: 'City Transport (Pvt) Ltd',
          status: 'PENDING',
          submittedDate: '2024-01-15',
          route: 'Colombo - Kandy',
          features: ['AC', 'WiFi', 'USB Charging']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedBuses = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/buses/status/APPROVED');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log('Backend approved bus data:', data.data);
          
          // Fetch users data to get phone numbers
          const usersResponse = await fetch('http://localhost:8081/api/users');
          let usersData = [];
          
          if (usersResponse.ok) {
            const usersResult = await usersResponse.json();
            if (usersResult.success && usersResult.data) {
              usersData = usersResult.data;
              console.log('Users data for approved buses:', usersData);
            }
          }
          
          // Transform backend data to include phone number and company from users table
          const transformedApprovedBuses = data.data.map(bus => {
            console.log('Processing approved bus:', bus);

            // Find the owner in users table
            const owner = usersData.find(user =>
              user.id === bus.ownerId ||
              user.name === bus.ownerName ||
              user.email === bus.ownerEmail
            );

            const phoneNumber = owner?.phone ||
                              owner?.phoneNumber ||
                              bus.ownerPhone ||
                              bus.phone ||
                              bus.owner?.phone ||
                              bus.ownerPhoneNumber ||
                              'N/A';

            const companyName = owner?.company ||
                              owner?.companyName ||
                              bus.companyName ||
                              bus.company ||
                              bus.owner?.company ||
                              bus.owner?.companyName ||
                              'N/A';

            console.log('Found approved bus owner:', owner, 'Phone:', phoneNumber, 'Company:', companyName);

            return {
              ...bus,
              ownerPhone: phoneNumber,
              companyName: companyName
            };
          });
          console.log('Transformed approved buses:', transformedApprovedBuses);
          setApprovedBuses(transformedApprovedBuses);
        }
      }
    } catch (error) {
      console.error('Error fetching approved buses:', error);
    }
  };

  const handleApprove = async (busId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [busId]: { approve: true } }));
      
      const response = await fetch(`http://localhost:8081/api/buses/${busId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setBuses(prev => prev.filter(bus => bus.id !== busId));
        fetchApprovedBuses(); // Refresh approved buses list
        alert('Bus approved successfully!');
      } else {
        const errorData = await response.json();
        console.error('Approve error:', errorData);
        alert(`Failed to approve bus: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error approving bus:', error);
      alert('Error approving bus. Please check your connection and try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [busId]: { approve: false } }));
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [selectedBus.id]: { reject: true } }));
      
      const response = await fetch(`http://localhost:8081/api/buses/${selectedBus.id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reason: rejectReason 
        })
      });

      if (response.ok) {
        setBuses(prev => prev.filter(bus => bus.id !== selectedBus.id));
        setShowRejectModal(false);
        setSelectedBus(null);
        setRejectReason('');
        alert('Bus rejected successfully!');
      } else {
        const errorData = await response.json();
        console.error('Reject error:', errorData);
        alert(`Failed to reject bus: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error rejecting bus:', error);
      alert('Error rejecting bus. Please check your connection and try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [selectedBus.id]: { reject: false } }));
    }
  };

  const openRejectModal = (bus) => {
    setSelectedBus(bus);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedBus(null);
    setRejectReason('');
  };

  const ApprovedBusCard = ({ bus }) => (
    <div className="bus-card approved-card">
      <div className="card-header">
        <div className="bus-info">
          <div className="bus-icon approved">
            <CheckCircle size={24} />
          </div>
          <div className="bus-details">
            <h3>{bus.busName}</h3>
            <p>{bus.registrationNumber}</p>
          </div>
        </div>
        <div className="status-badge approved">
          <CheckCircle size={16} />
          APPROVED
        </div>
      </div>

      <div className="card-body">
        <div className="info-grid">
          <div className="info-item">
            <User size={16} />
            <span className="label">Owner:</span>
            <span className="value">{bus.ownerName}</span>
          </div>
          <div className="info-item">
            <Phone size={16} />
            <span className="label">Phone:</span>
            <span className="value">{bus.ownerPhone}</span>
          </div>
          <div className="info-item">
            <Bus size={16} />
            <span className="label">Capacity:</span>
            <span className="value">{bus.seatingCapacity} seats</span>
          </div>
          <div className="info-item">
            <MapPin size={16} />
            <span className="label">Route:</span>
            <span className="value">{bus.route}</span>
          </div>
          <div className="info-item">
            <Calendar size={16} />
            <span className="label">Approved:</span>
            <span className="value">{new Date(bus.submittedDate).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="label">Company:</span>
            <span className="value">{bus.companyName}</span>
          </div>
        </div>

        {bus.features && bus.features.length > 0 && (
          <div className="features-section">
            <h4>Features:</h4>
            <div className="features-list">
              {bus.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-actions approved-actions">
        <div className="approved-info">
          <CheckCircle size={16} />
          <span>This bus has been approved and is now active</span>
        </div>
      </div>
    </div>
  );

  const BusCard = ({ bus }) => (
    <div className="bus-card">
      <div className="card-header">
        <div className="bus-info">
          <div className="bus-icon">
            <Bus size={24} />
          </div>
          <div className="bus-details">
            <h3 className="bus-name">{bus.busName}</h3>
            <p className="registration">{bus.registrationNumber}</p>
          </div>
        </div>
        <div className="status-badge pending">
          PENDING
        </div>
      </div>

      <div className="card-body">
        <div className="info-grid">
          <div className="info-item">
            <User size={16} />
            <span className="label">Owner:</span>
            <span className="value">{bus.ownerName}</span>
          </div>
          <div className="info-item">
            <Phone size={16} />
            <span className="label">Phone:</span>
            <span className="value">{bus.ownerPhone}</span>
          </div>
          <div className="info-item">
            <Bus size={16} />
            <span className="label">Capacity:</span>
            <span className="value">{bus.seatingCapacity} seats</span>
          </div>
          <div className="info-item">
            <MapPin size={16} />
            <span className="label">Route:</span>
            <span className="value">{bus.route}</span>
          </div>
          <div className="info-item">
            <Calendar size={16} />
            <span className="label">Submitted:</span>
            <span className="value">{new Date(bus.submittedDate).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="label">Company:</span>
            <span className="value">{bus.companyName}</span>
          </div>
        </div>

        {bus.features && bus.features.length > 0 && (
          <div className="features-section">
            <h4>Features:</h4>
            <div className="features-list">
              {bus.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button 
          className="btn-approve"
          onClick={() => handleApprove(bus.id)}
          disabled={loadingStates[bus.id]?.approve}
        >
          {loadingStates[bus.id]?.approve ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <CheckCircle size={16} />
              Approve
            </>
          )}
        </button>
        <button 
          className="btn-reject"
          onClick={() => openRejectModal(bus)}
          disabled={loadingStates[bus.id]?.reject}
        >
          {loadingStates[bus.id]?.reject ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <XCircle size={16} />
              Reject
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-approve-container">
      <div className="approve-header">
        <div className="header-content">
          <h1>Bus Approval System</h1>
          <p>Review and approve pending bus registrations</p>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <XCircle size={24} />
          </button>
        )}
      </div>

      <div className="approve-content">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={20} />
            Pending Buses ({buses.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            <CheckCircle size={20} />
            Approved Buses ({approvedBuses.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' ? (
          loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading pending buses...</p>
            </div>
          ) : buses.length === 0 ? (
            <div className="empty-state">
              <Bus size={64} />
              <h3>No Pending Buses</h3>
              <p>All bus registrations have been processed.</p>
            </div>
          ) : (
            <div className="buses-grid">
              {buses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>
          )
        ) : (
          loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading approved buses...</p>
            </div>
          ) : approvedBuses.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={64} />
              <h3>No Approved Buses</h3>
              <p>No buses have been approved yet.</p>
            </div>
          ) : (
            <div className="buses-grid">
              {approvedBuses.map((bus) => (
                <ApprovedBusCard key={bus.id} bus={bus} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Bus Registration</h3>
              <button className="modal-close" onClick={closeRejectModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="bus-info-modal">
                <h4>{selectedBus?.busName}</h4>
                <p>Registration: {selectedBus?.registrationNumber}</p>
                <p>Owner: {selectedBus?.ownerName}</p>
              </div>
              <div className="form-group">
                <label htmlFor="rejectReason">Reason for Rejection *</label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this bus registration..."
                  rows="4"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeRejectModal}>
                Cancel
              </button>
              <button 
                className="btn-confirm-reject"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Reject Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprove;
