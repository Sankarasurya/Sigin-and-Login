import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/welcome', { withCredentials: true })
    .then((res) => {
        if (res.data.Status === 'Success') {
          if (allowedRole && res.data.role !== allowedRole) {
            navigate('/login');
          } else {
            setLoading(false);
          }
        } else {
          navigate('/login');
        }
      })
      .catch(() => {
        navigate('/login');
      });
  }, [allowedRole, navigate]);

  if (loading) return <p>Loading...</p>;

  return children;
}
