import React from 'react';
import HomeTabs from '../components/Tabs';

const HomeScreen = ({ route, setIsLoggedIn }) => {
  return <HomeTabs route={route} setIsLoggedIn={setIsLoggedIn} />;
};

export default HomeScreen;
