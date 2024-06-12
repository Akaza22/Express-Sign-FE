import React, { useState } from 'react';
import { Card, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import SignLanguageDetection from './SignLanguange';
import DashboardNavbar from './Navbar'; 

export default function Dashboard() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      history.push('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  return (
    <>
      <DashboardNavbar /> {/* Navbar di bagian atas */}

      <Container className="mt-5 pt-5">
        <div className="d-flex flex-row flex-wrap justify-content-around">
          <Card className="mb-4" style={{ flex: '1 0 30%', minWidth: '250px', maxWidth: '400px' }}>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
              </Link>
            </Card.Body>
          </Card>

          <Card className="mb-4" style={{ flex: '1 0 30%', minWidth: '250px', maxWidth: '400px' }}>
            <Card.Body>
              <ImageUpload />
            </Card.Body>
          </Card>

          <Card className="mb-4" style={{ flex: '1 0 30%', minWidth: '250px', maxWidth: '400px' }}>
            <Card.Body>
              <SignLanguageDetection />
            </Card.Body>
          </Card>
        </div>

        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Container>
    </>
  );
}
