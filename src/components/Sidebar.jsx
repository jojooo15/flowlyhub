import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaChartBar, 
  FaMoneyBillWave, 
  FaCog, 
  FaWarehouse,
  FaLock
} from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Produk' },
    { path: '/transactions', icon: <FaShoppingCart />, label: 'Transaksi' },
    { path: '/reports', icon: <FaChartBar />, label: 'Laporan' },
    { path: '/expenses', icon: <FaMoneyBillWave />, label: 'Pengeluaran' },
    { path: '/inventory', icon: <FaWarehouse />, label: 'Stok' },
    { path: '/settings', icon: <FaCog />, label: 'Pengaturan' },
    { path: '/security', icon: <FaLock />, label: 'Keamanan' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>FlowlyHub</h2>
      </div>
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
