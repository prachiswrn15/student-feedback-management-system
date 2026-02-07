import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeedbackList = ({ reload, isAdmin }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const fetchFeedbacks = () => {
    axios.get('http://localhost:5000/api/feedback')
      .then(res => {
        setFeedbacks(res.data);
        const total = res.data.reduce((sum, fb) => sum + parseFloat(fb.rating), 0);
        const avg = res.data.length > 0 ? (total / res.data.length).toFixed(1) : 0;
        setAverageRating(avg);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [reload]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/${id}`);
        toast.success("🗑️ Feedback deleted!");
        fetchFeedbacks();
      } catch (err) {
        toast.error("❌ Failed to delete feedback");
        console.error(err);
      }
    }
  };

  const filteredFeedbacks = feedbacks
    .filter(fb =>
      fb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.submittedAt) - new Date(a.submittedAt);
      if (sortOption === 'oldest') return new Date(a.submittedAt) - new Date(b.submittedAt);
      if (sortOption === 'highest') return b.rating - a.rating;
      if (sortOption === 'lowest') return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="feedback-list">
      <h2>📋 All Feedback Entries</h2>

      <input
        type="text"
        placeholder="🔍 Search by name or subject"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="sort-dropdown"
      >
        <option value="newest">🕒 Newest First</option>
        <option value="oldest">📅 Oldest First</option>
        <option value="highest">⭐ Highest Rating</option>
        <option value="lowest">🔻 Lowest Rating</option>
      </select>

      {filteredFeedbacks.length > 0 && (
        <div className="average-rating">
          ⭐ Average Rating: <strong>{averageRating} / 5</strong>
        </div>
      )}

      {filteredFeedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        filteredFeedbacks.map(fb => (
          <div key={fb.id} className="feedback-card">
            <strong>{fb.name}</strong> – {fb.subject} – ⭐ {fb.rating}
            <p>{fb.comments}</p>
            <p className="timestamp">
              🕒 Submitted on: {fb.submittedAt
                ? new Date(fb.submittedAt).toLocaleString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: 'numeric', minute: 'numeric', hour12: true
                  })
                : 'N/A'}
            </p>

            {/* ✅ Only show delete button to Admin */}
            {isAdmin && (
              <button onClick={() => handleDelete(fb.id)} className="delete-button">
                🗑️ Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackList;
