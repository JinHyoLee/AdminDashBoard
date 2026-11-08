import type { ComponentType } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { useNavStore, type PageKey } from './stores/navStore';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';

const PAGES: Record<PageKey, ComponentType> = {
  dashboard: DashboardPage,
  users: UsersPage,
  products: ProductsPage,
  orders: OrdersPage,
  statistics: StatisticsPage,
  settings: SettingsPage,
};

export default function App() {
  const current = useNavStore((s) => s.current);
  const Page = PAGES[current];

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="content">
          <Page />
        </main>
      </div>
    </div>
  );
}
