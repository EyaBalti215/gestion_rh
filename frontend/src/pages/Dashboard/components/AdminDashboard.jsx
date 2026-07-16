import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import './AdminDashboard.css';
import Inscriptions from './Inscriptions';
import AdminPointage from './AdminPointage';
import AdminCongesPage from './AdminCongesPage';
import AdminEmployees from './AdminEmployees';
import AdminServices from './AdminServices';
import AdminFournisseurs from './AdminFournisseurs';
import AdminNotifications from './AdminNotifications';
import Profile from './Profile';

const sidebarItems = [
	{ key: 'dashboard', label: 'Tableau de bord', icon: '📊' },
	{ key: 'profil', label: 'Mon profil', icon: '👤' },
	{ key: 'employes', label: 'Employés & RH', icon: '👥' },
	{ key: 'inscriptions', label: 'Inscriptions', icon: '📝', badge: '3' },
	{ key: 'pointage', label: 'Pointage', icon: '⏱️' },
	{ key: 'conges', label: 'Congés & Absences', icon: '🏖️' },
	{ key: 'paie', label: 'Paie & Salaires', icon: '💰' },
	{ key: 'services', label: 'Services & Factures', icon: '📋' },
	{ key: 'fournisseurs', label: 'Fournisseurs', icon: '🚚' },
	{ key: 'finance', label: 'Finance & Rapports', icon: '📈' },
	{ key: 'notifications', label: 'Notifications', icon: '🔔' },
	{ key: 'systeme', label: 'Admin Système', icon: '⚙️' },
];

const cards = [
	{ label: 'Employés actifs', value: '6', detail: '1 en congé', icon: '👤', color: 'purple', trend: '0%' },
	{ label: 'Masse salariale', value: '25 290 DA', detail: 'Masse salariale', icon: '€', color: 'blue', trend: '↘ 2%' },
	{ label: 'Recettes Juin', value: '63 500 DA', detail: 'Recettes Juin', icon: '📈', color: 'green', trend: '↗ 11%' },
	{ label: 'Résultat net', value: '34 130 DA', detail: 'Résultat net', icon: '📊', color: 'violet', trend: '↗ 8%' },
];

export default function AdminDashboard({ user, onLogout }) {
	const [activePage, setActivePage] = useState('inscriptions');
	const [notificationCount, setNotificationCount] = useState(0);

	const handleNotificationsClick = () => {
		setActivePage('notifications');
	};

	useEffect(() => {
		const fetchNotificationCount = async () => {
			try {
				const res = await apiFetch('/notifications');
				if (!res.ok) return;
				const data = await res.json();
				const unread = Array.isArray(data)
					? data.filter((notif) => !notif.lu).length
					: 0;
				setNotificationCount(unread);
			} catch (e) {
				console.error(e);
			}
		};

		fetchNotificationCount();
		const interval = setInterval(fetchNotificationCount, 30000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="admin-app">
			<aside className="admin-sidebar">
				<div className="brand-sidebar">
					<div className="brand-logo">HR</div>
					<div className="brand-text">
						<strong>HRFlow</strong>
						<span>Administration</span>
					</div>
				</div>

				<nav className="sidebar-nav">
					{sidebarItems.map((item) => (
						<button
							key={item.key}
							className={`sidebar-link${activePage === item.key ? ' active' : ''}`}
							onClick={() => setActivePage(item.key)}
						>
							<span className="sidebar-icon">{item.icon}</span>
							<span>{item.label}</span>
							{item.key === 'notifications' ? (
								notificationCount > 0 ? (
									<span className="sidebar-badge">{notificationCount}</span>
								) : null
							) : item.badge ? (
								<span className="sidebar-badge">{item.badge}</span>
							) : null}
						</button>
					))}
				</nav>

				<div className="sidebar-footer">
					<div className="sidebar-user-row">
						<div className="avatar-circle">{user?.prenom?.[0]?.toUpperCase() || 'A'}</div>
						<div>
							<div className="sidebar-user">{user?.prenom || 'Admin'} {user?.nom || 'Système'}</div>
							<div className="sidebar-user-role">Super Admin</div>
						</div>
					</div>
					<button className="logout-small" onClick={onLogout}>Déconnexion</button>
				</div>
			</aside>

			<main className="admin-main">
				<header className="admin-topbar">
					<div className="search-box">
						<span className="search-icon">🔍</span>
						<input type="search" placeholder="Rechercher..." />
					</div>
					<div className="topbar-actions">
						<button className="icon-button" onClick={handleNotificationsClick}>
							🔔
							{notificationCount > 0 && <span className="badge">{notificationCount}</span>}
						</button>
						<div className="user-badge">AD</div>
					</div>
				</header>

				<section className="admin-header">
					<h1>{sidebarItems.find((i) => i.key === activePage)?.label || 'Tableau de bord'}</h1>
				</section>

				{activePage === 'dashboard' ? (
					<>
						<section className="dashboard-cards">
							{cards.map((card) => (
								<article key={card.label} className="metric-card">
									<div className={`metric-icon ${card.color}`}>{card.icon}</div>
									<div className="metric-content">
										<div className="metric-top">
											<p>{card.label}</p>
											<span className="metric-trend">{card.trend}</span>
										</div>
										<strong>{card.value}</strong>
										<span className="metric-detail">{card.detail}</span>
									</div>
								</article>
							))}
						</section>
						<section className="dashboard-panels">
							<div className="panel chart-panel">
								<div className="panel-header"><h2>Évolution financière — 6 mois</h2><span>Juin</span></div>
								<div className="chart-placeholder">Graphique ligne ici</div>
							</div>
							<div className="panel donut-panel">
								<div className="panel-header"><h2>Répartition Juin</h2></div>
								<div className="donut-grid"><div className="donut-circle" /><div className="donut-legend"><div><span className="legend-dot purple" /> Masse salariale <strong>25 290 DA</strong></div><div><span className="legend-dot blue" /> Services & IT <strong>974 DA</strong></div><div><span className="legend-dot yellow" /> Charges courantes <strong>3 106 DA</strong></div><div><span className="legend-dot green" /> Résultat net <strong>34 130 DA</strong></div></div></div>
							</div>
						</section>
					</>
								) : activePage === 'profil' ? (
									<Profile />
								) : activePage === 'employes' ? (
									<AdminEmployees />
								) : activePage === 'inscriptions' ? (
									<Inscriptions />
								) : activePage === 'pointage' ? (
									<AdminPointage />
								) : activePage === 'conges' ? (
									<AdminCongesPage />
								) : activePage === 'services' ? (
									<AdminServices />
								) : activePage === 'fournisseurs' ? (
									<AdminFournisseurs />
								) : activePage === 'notifications' ? (
									<AdminNotifications />
								) : (
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#9ca3af', fontSize: '1rem' }}>
						Section « {sidebarItems.find((i) => i.key === activePage)?.label} » — en cours de développement
					</div>
				)}
			</main>
		</div>
	);
}