import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Data Proxy</h1>
      <p>Secure and efficient data management solutions.</p>
      <button
        style={{ padding: '10px 20px', fontSize: '16px' }}
        onClick={() => navigate({ to: '/signup' })}
      >
        Get Started
      </button>
    </div>
  );
};

export const Route = createFileRoute('/_layout')({
  component: LandingPage,
});

export default LandingPage;