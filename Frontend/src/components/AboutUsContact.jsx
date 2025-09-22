
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AboutUsContact() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        marginBottom: '60px',
        padding: '20px',
        borderRadius: '10px',
        background: '#474747',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        flexDirection: 'row',
        transition: 'transform 0.3s ease',
        '@media (max-width: 768px)': {
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ flex: 1, padding: '20px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '2.2rem',
            color: '#fff',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Contact Us
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography sx={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1.5rem' }}>
            <strong>Email:</strong> hello@criticrew.com
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1.5rem' }}>
            <strong>Location:</strong> San Francisco, CA
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1.5rem' }}>
            Follow us on social media for the latest updates and film discussions:
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <li>Twitter: @CritiCrew</li>
            <li>Instagram: @CritiCrew</li>
            <li>Facebook: /CritiCrew</li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AboutUsContact;