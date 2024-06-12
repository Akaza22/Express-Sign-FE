import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Container, Table, Alert, Button} from 'react-bootstrap';
import DashboardNavbar from './Navbar';

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get(process.env.REACT_APP_API_HISTORY, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching detection history:', error);
        setError('Unable to fetch detection history.');
      }
    };

    fetchHistory();
  }, [currentUser]);

  const handleDelete = async (detectionId) => {
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = process.env.REACT_APP_API_DELETE;
      await axios.delete(`${apiUrl}/${detectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setHistory(history.filter(item => item.detectionId !== detectionId));
    } catch (error) {
      console.error('Error deleting detection:', error);
      setError('Unable to delete detection.');
    }
  };

  return (
    <>
      <DashboardNavbar />
      <Container className="mt-5">
        <h2>Detection History</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Detected Data</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>{item.detectionType}</td>
                <td>
                  {item.data
                    ? item.data.detectedExpression || item.data.detectedSignLanguange || 'N/A'
                    : 'N/A'}
                </td>
                <td>
                  {item.data && item.data.imageUrl ? (
                    <img src={item.data.imageUrl} alt="Detection" style={{ maxWidth: '100px' }} />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(item.detectionId)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default History;
