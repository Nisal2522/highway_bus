// TourMain.js
import React, { useState, useEffect } from 'react';
import BusBookingCard from './BusBookingCard';


const TourMain = ({ onViewDetails, sampleRoutes, selectedCategory }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredRoutes, setFilteredRoutes] = useState([]);
	const [activeFilter, setActiveFilter] = useState(selectedCategory || 'all');
	const [expandedCard, setExpandedCard] = useState(null);

	const handleSearch = (query) => {
		setSearchQuery(query);
		filterRoutes(query);
	};

	const handleFilterChange = (filter) => {
		setActiveFilter(filter);
		filterRoutes(searchQuery, filter);
	};

	const filterRoutes = (query = searchQuery, filter = activeFilter) => {
		let filtered = sampleRoutes;
		
		// Filter by search query
		if (query.trim()) {
			filtered = filtered.filter(route => 
				route.arrivalCity.toLowerCase().includes(query.toLowerCase()) ||
				route.title.toLowerCase().includes(query.toLowerCase()) ||
				route.description.toLowerCase().includes(query.toLowerCase())
			);
		}
		
		// Filter by category
		if (filter && filter !== 'all') {
			if (filter === 'beaches') {
				// Show only beach destinations like Galle
				filtered = filtered.filter(route => 
					route.arrivalCity.toLowerCase().includes('galle') ||
					route.category === 'beaches' ||
					route.title.toLowerCase().includes('beach') ||
					route.description.toLowerCase().includes('beach')
				);
			} else {
				filtered = filtered.filter(route => route.category === filter);
			}
		}
		
		setFilteredRoutes(filtered);
	};

	// Initialize with all routes
	useEffect(() => {
		setFilteredRoutes(sampleRoutes);
	}, [sampleRoutes]);

	// Auto-filter when search query or active filter changes
	useEffect(() => {
		if (sampleRoutes.length > 0) {
			filterRoutes();
		}
	}, [searchQuery, activeFilter, sampleRoutes]);

	const handleBook = (routeId) => {
		console.log('Booking route:', routeId);
	};

	const handleCardToggle = (routeId) => {
		setExpandedCard(expandedCard === routeId ? null : routeId);
	};

	return (
		<div className="tour-main">
			{/* Search and Filter Header */}
			<div className="tour-header">
				<div className="search-container">
					<div className="search-input-wrapper">
						<input
							type="text"
							placeholder="Search destinations or experiences..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="search-input"
						/>
						<svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
							<line x1="16.65" y1="16.65" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						</svg>
					</div>
				</div>
				
				{/* Filter Buttons */}
				<div className="filter-buttons">
					<button 
						className={`filter-btn all ${activeFilter === 'all' ? 'active' : ''}`}
						onClick={() => handleFilterChange('all')}
					>
						<span>All</span>
					</button>
					<button 
						className={`filter-btn beaches ${activeFilter === 'beaches' ? 'active' : ''}`}
						onClick={() => handleFilterChange('beaches')}
					>
						<span>Beaches</span>
					</button>
					<button 
						className={`filter-btn heritage ${activeFilter === 'heritage' ? 'active' : ''}`}
						onClick={() => handleFilterChange('heritage')}
					>
						<span>Heritage</span>
					</button>
					<button 
						className={`filter-btn nature ${activeFilter === 'nature' ? 'active' : ''}`}
						onClick={() => handleFilterChange('nature')}
					>
						<span>Nature & Adventure</span>
					</button>
				</div>
			</div>

			{/* Bus Booking Cards */}
			<div className="content-container">
				<div className="bus-routes-container">
					{filteredRoutes.length > 0 ? (
						filteredRoutes.map((route, index) => {
							// Create uneven grid classes
							const gridClasses = [];
							if (index % 7 === 0) gridClasses.push('grid-large');
							else if (index % 5 === 0) gridClasses.push('grid-medium');
							else if (index % 3 === 0) gridClasses.push('grid-small');
							
							return (
								<BusBookingCard
									key={route.id}
									departureCity={route.departureCity}
									arrivalCity={route.arrivalCity}
									explorationTime={route.explorationTime}
									price={route.price}
									availableSeats={route.availableSeats}
									rating={route.rating}
									imageUrl={route.imageUrl}
									description={route.description}
									title={route.title}
									onBook={() => handleBook(route.id)}
									onViewDetails={() => onViewDetails(route.id)}
									isExpanded={expandedCard === route.id}
									onToggle={() => handleCardToggle(route.id)}
									className={gridClasses.join(' ')}
								/>
							);
						})
					) : (
						<div className="no-routes-message">
							<p>No routes found matching your criteria.</p>
							<p>Try adjusting your filters or search parameters.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TourMain;
