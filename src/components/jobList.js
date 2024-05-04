import React from 'react';

function JobCard({ job }) {
  const jobDetails = job.jobDetailsFromCompany.split(" ").slice(0, 100).join(" ");
  const displayJobDetails = jobDetails.length < job.jobDetailsFromCompany.length ? jobDetails + "..." : jobDetails;

  return (
    <div className="job-card">
      <div className="job-details">
      <div className="company-logo">
        <img src={job.logoUrl} alt={job.companyName} />
      </div>
      <div className='job-detail'>
        <h3>{job.companyName}</h3>
        <h3>{job.jobRole}</h3>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Estimated Salary:</strong> {job.minJdSalary} - {job.maxJdSalary} {job.salaryCurrencyCode}</p>
      </div>
      </div>
        <div>
        <p><strong>About Company:</strong> {displayJobDetails}</p>
        <p><strong>Minimum Experience:</strong> {job.minExp} years</p>
        <button className="easy-apply-button">Easy Apply</button>
      </div>
    </div>
  );
}

export default JobCard;
