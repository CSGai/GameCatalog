import React from 'react';
import FadeText from '../TextFade';
import '../../styles/frontPage.css'

interface GreetingProps {
  username: string;
}

const Greeting: React.FC<GreetingProps> = ({ username }) => {
  return (
    <div className='centered intro-container'>
      <FadeText direction='fade' elements={[
              <h1>Hello, {username}!</h1>,
              <p>Welcome to my website. glad you're here!</p>
      ]}
      />
    </div>
  );
};

export default Greeting;