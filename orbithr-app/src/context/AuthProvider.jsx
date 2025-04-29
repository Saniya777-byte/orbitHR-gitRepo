import React, { createContext, useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/LocalStorage';

export const AuthContext = createContext();

const calculateTaskCounts = (tasks) => {
  const counts = {
    newTask: 0,
    active: 0,
    completed: 0,
    failed: 0
  };
  
  if (!tasks || !Array.isArray(tasks)) return counts;
  
  tasks.forEach(task => {
    if (task.newTask) counts.newTask++;
    if (task.active) counts.active++;
    if (task.completed) counts.completed++;
    if (task.failed) counts.failed++;
  });
  
  return counts;
};

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const { employees } = getLocalStorage();

        const fixedEmployees = employees?.map(employee => {
            const correctCounts = calculateTaskCounts(employee.tasks);
            
            return {
                ...employee,
                taskCounts: correctCounts
            };
        }) || [];
        
        setUserData(fixedEmployees);
    }, []);
    
    useEffect(() => {
        if (userData.length > 0) {
            setLocalStorage(userData);
        }
    }, [userData]);

    const setUserDataWithFixedCounts = (newUserData) => {
        if (typeof newUserData === 'function') {
            setUserData(prevData => {
                const updatedData = newUserData(prevData);
            
                return updatedData.map(employee => ({
                    ...employee,
                    taskCounts: calculateTaskCounts(employee.tasks)
                }));
            });
        } else {
            const fixedData = newUserData.map(employee => ({
                ...employee,
                taskCounts: calculateTaskCounts(employee.tasks)
            }));
            
            setUserData(fixedData);
        }
    };

    return (
        <AuthContext.Provider value={[userData, setUserDataWithFixedCounts]}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;