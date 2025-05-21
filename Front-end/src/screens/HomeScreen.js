import React from 'react';
import HomeTabs from '../components/Tabs';

const HomeScreen = ({ userName, setIsLoggedIn }) => {
  return <HomeTabs userName={userName} setIsLoggedIn={setIsLoggedIn} />;
};

export default HomeScreen;
