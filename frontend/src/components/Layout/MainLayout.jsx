import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className={styles.bodyWrapper}>
        <Sidebar />
        <div className={styles.mainContent}>
          <main className={styles.pageOutlet}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}