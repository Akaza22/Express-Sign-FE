import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Form, Button } from 'react-bootstrap';

const SignLanguange = () => {
  const { currentUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Pilih gambar terlebih dahulu.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = await currentUser.getIdToken(); 
      const response = await axios.post(process.env.REACT_APP_API_SIGN, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        },
      });

      console.log('Response:', response.data);

      setPrediction(response.data.detectedSignLanguange);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h2>Sign Languange</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Pilih Gambar</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Mendeteksi...' : 'Detect'}
        </Button>
      </Form>
      {prediction && (
        <p className="mt-3">Hasil Deteksi: {prediction}</p>
      )}
    </div>
  );
};

export default SignLanguange;
