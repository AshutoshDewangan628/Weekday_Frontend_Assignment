import React, { useState, useEffect, useRef } from 'react';
import JobList from './jobList';

function JobCard() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minExperience: '',
    companyName: '',
    location: '',
    isRemote: false,
    techStack: '',
    role: '',
    minBasePay: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const body = JSON.stringify({
          "limit": 10,
          "offset": (currentPage - 1) * 10
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body
        };

        const response = await fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        setJobs(prevJobs => [...prevJobs, ...jsonData.jdList]); // Append fetched job list to existing jobs
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchData();
  }, [currentPage]); // Fetch data whenever currentPage changes

  useEffect(() => {
    // Initialize IntersectionObserver
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetching) {
        setCurrentPage(prevPage => prevPage + 1); // Load more jobs when user scrolls to the bottom
      }
    }, { threshold: 1 });

    // Start observing the bottom element
    const bottomElement = document.getElementById('bottom');
    if (bottomElement && observer.current) {
      observer.current.observe(bottomElement);
    }

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isFetching]);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const filterValue = type === 'checkbox' ? checked : value;

    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: filterValue
    }));
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.minExperience && job.minExp < parseInt(filters.minExperience)) {
      return false;
    }
    if (filters.companyName && !job.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) {
      return false;
    }
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.isRemote && !job.isRemote) {
      return false;
    }
    if (filters.techStack && !job.techStack.toLowerCase().includes(filters.techStack.toLowerCase())) {
      return false;
    }
    if (filters.role && !job.role.toLowerCase().includes(filters.role.toLowerCase())) {
      return false;
    }
    if (filters.minBasePay) {
      const minBasePay = parseInt(filters.minBasePay);
      if (!job.minJdSalary || job.minJdSalary < minBasePay) {
        return false;
      }
    }
    return true;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div >
      {/* Render filter input fields or select dropdowns */}
      <div className='filter'>
      <select className='filter_spe' name="minExperience" value={filters.minExperience} onChange={handleFilterChange}>
        <option value="">Minimum Experience</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <input className='filter_spe' type="text" name="companyName" value={filters.companyName} onChange={handleFilterChange} placeholder="Company Name" />
      <input className='filter_spe' type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" />
      <label  className='filter_spe'>
        <input type="checkbox" name="isRemote" checked={filters.isRemote} onChange={handleFilterChange} />
        Remote
      </label>
      <input className='filter_spe' type="text" name="techStack" value={filters.techStack} onChange={handleFilterChange} placeholder="Tech Stack" />
      <input className='filter_spe' type="text" name="role" value={filters.role} onChange={handleFilterChange} placeholder="Role" />
      <select className='filter_spe' name="minBasePay" value={filters.minBasePay} onChange={handleFilterChange}>
        <option value="">Minimum Base Pay</option>
        {[10, 20, 30, 40, 50, 60, 70].map(amount => (
          <option key={amount} value={amount}>{amount}</option>
        ))}
      </select>
      </div>
      <div className="job-listings">
        {filteredJobs.map(job => (
          <JobList key={job.jdUid} job={job} />
        ))}
      </div>
      {/* Placeholder element to observe for intersection */}
      <div id="bottom"></div>
    </div>
  );
}

export default JobCard;


