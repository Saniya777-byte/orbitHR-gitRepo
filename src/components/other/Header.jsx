import React from 'react';

const Header = ({ changeUser, data }) => {
  const logOutUser = () => {
    localStorage.removeItem('loggedInUser');
    changeUser(null);  

    window.location.reload();
  };

  const username = data?.firstName || 'Admin';

  return (
    <div className='flex items-end justify-between'>
      <h1 className='text-2xl font-medium'>Hello <br /> 
        <span className='text-3xl font-semibold'>{username} 👋</span>
      </h1>
      <button 
        onClick={logOutUser}
        className='bg-red-600 text-base font-medium text-white px-5 py-2 rounded-sm hover:bg-red-700 transition-colors'
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;