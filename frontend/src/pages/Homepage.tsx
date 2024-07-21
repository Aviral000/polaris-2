import React from 'react';
import '../styles/Homepage.scss';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export default function Homepage() {
  return (
    <main>
      <Header />
      <div className="homepage-container">
        <div className="shake large-text">POLARIS</div>
        <div className="shake">THE TASK REMINDER</div>
        <Link to="/signup" className="get-started-link">
          Let's Get Started <FaArrowRight className="arrow-icon" />
        </Link>
      </div>
    </main>
  );
}
