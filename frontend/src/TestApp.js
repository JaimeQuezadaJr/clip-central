import React from 'react';

function TestApp() {
  // Log when component mounts
  React.useEffect(() => {
    console.log('TestApp mounted');
    
    // Log browser information
    console.log('User Agent:', navigator.userAgent);
    console.log('Window Size:', window.innerWidth, 'x', window.innerHeight);
    
    // Check if we're in production
    console.log('Environment:', process.env.NODE_ENV);
    
    // Test if basic DOM manipulation works
    try {
      document.title = 'Test Page Working';
      console.log('DOM manipulation successful');
    } catch (e) {
      console.error('DOM manipulation failed:', e);
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '40px auto', 
      fontFamily: 'Arial, sans-serif',
      border: '2px solid blue',
      borderRadius: '8px',
      background: '#f0f8ff'
    }}>
      <h1 style={{ color: 'navy' }}>Test Page</h1>
      <p>If you can see this text, React is rendering correctly.</p>
      <p>The time is: {new Date().toLocaleTimeString()}</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          background: 'navy',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
    </div>
  );
}

export default TestApp; 