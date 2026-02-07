// FeedbackForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ toast import
import 'react-toastify/dist/ReactToastify.css'; // ✅ toast CSS

const FeedbackForm = ({ onFeedbackSubmit }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !subject || !rating || !comments) {
    toast.warning("⚠️ All fields are required!");
    return;
  }

  try {
    const feedback = {
      name,
      subject,
      rating,
      comments,
      submittedAt: new Date().toISOString()  // ✅ added in correct format
    };

    await axios.post('http://localhost:5000/api/feedback', feedback);

    setName('');
    setSubject('');
    setRating('');
    setComments('');
    toast.success("✅ Feedback submitted successfully!");
    onFeedbackSubmit();
  } catch (err) {
    toast.error("❌ Failed to submit feedback!");
    console.error(err);
  }
};


  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="feedback-form">
        <h2>📋 Student Feedback Form</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="">Select Subject</option>
          <option value="Math">Math</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="English">English</option>
          <option value="Biology">Biology</option>
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        >
          <option value="">Select Rating</option>
          <option value="1">⭐ 1 - Poor</option>
          <option value="2">⭐ 2 - Fair</option>
          <option value="3">⭐ 3 - Good</option>
          <option value="4">⭐ 4 - Very Good</option>
          <option value="5">⭐ 5 - Excellent</option>
        </select>

        <textarea
          placeholder="Write your comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
        />

        <button type="submit">🚀 Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
