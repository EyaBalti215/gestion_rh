import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import './AdminNotifications.css';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('toutes');
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/notifications');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      const notifList = Array.isArray(data) ? data : [];
      setNotifications(notifList);
      
      const unread = notifList.filter((n) => !n.lu).length;
      setUnreadCount(unread);
    } catch (e) {
      console.error(e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await apiFetch(`/notifications/${notificationId}/mark-read`, {
        method: 'PUT',
      });

      if (!res.ok) throw new Error('Failed to update');
      await loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await apiFetch('/notifications/mark-all-read', {
        method: 'PUT',
      });

      if (!res.ok) throw new Error('Failed to update');
      await loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const res = await apiFetch(`/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      await loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['toutes', 'inscriptions', 'conges', 'paie', 'factures', 'absences'];

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'toutes') return true;
    if (activeTab === 'non-lues') return !notif.lu;
    return notif.categorie?.toLowerCase() === activeTab;
  });

  const getCategoryIcon = (categorie) => {
    const icons = {
      inscriptions: '👤',
      conges: '🏖️',
      paie: '💰',
      factures: '📋',
      absences: '🕐',
    };
    return icons[categorie] || '🔔';
  };

  const getCategoryColor = (categorie) => {
    const colors = {
      inscriptions: 'icon-blue',
      conges: 'icon-yellow',
      paie: 'icon-purple',
      factures: 'icon-red',
      absences: 'icon-green',
    };
    return colors[categorie] || 'icon-gray';
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return notifDate.toLocaleDateString('fr-FR');
  };

  return (
    <div className="notifications-page">
      <div className="notif-header">
        <h2>
          <span className="notif-icon">🔔</span>
          Notifications
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </h2>
        {unreadCount > 0 && (
          <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
            ✓ Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="notif-tabs">
        {['toutes', 'non-lues', 'inscriptions', 'conges', 'paie', 'factures', 'absences'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'toutes' && 'Toutes'}
            {tab === 'non-lues' && (
              <>
                Non lues <span className="tab-count">{unreadCount}</span>
              </>
            )}
            {tab === 'inscriptions' && 'Inscriptions'}
            {tab === 'conges' && 'Congés'}
            {tab === 'paie' && 'Paie'}
            {tab === 'factures' && 'Factures'}
            {tab === 'absences' && 'Absences'}
          </button>
        ))}
      </div>

      <div className="notif-list">
        {loading ? (
          <div className="notif-loading">Chargement...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notif-empty">
            <p>Aucune notification</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notif-item ${notif.lu ? 'read' : 'unread'}`}
              onClick={() => !notif.lu && handleMarkAsRead(notif.id)}
            >
              <div
                className={`notif-icon-box ${getCategoryColor(notif.categorie)}`}
              >
                {getCategoryIcon(notif.categorie)}
              </div>

              <div className="notif-content">
                <div className="notif-title">
                  <strong>{notif.titre}</strong>
                  {!notif.lu && <span className="notif-dot">●</span>}
                </div>
                <p className="notif-description">{notif.description}</p>
                <span className="notif-time">{getTimeAgo(notif.dateCreation)}</span>
              </div>

              <button
                className="notif-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notif.id);
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
