import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeIndianRupee, ReceiptIndianRupee, WalletCards, Users, TrendingUp, TrendingDown } from 'lucide-react';
import useDashboard from '../hooks/useDashboard';
import SummaryCard from '../components/SummaryCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useLanguage } from '../i18n';

const Dashboard = () => {
  const { summary, loading, error } = useDashboard();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  const isDeficit = summary.balance < 0;

  return (
    <div className="page-container fade-in" id="dashboard-page">
      <div className="page-header">
        <h1>{t('dashboard')}</h1>
        <p className="page-subtitle">{t('festivalOverview')}</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="summary-cards">
        <SummaryCard
          title={t('totalContribution')}
          amount={formatCurrency(summary.totalContribution)}
          icon={<BadgeIndianRupee />}
          colorClass="card-green"
          subtitle={`${summary.totalContributionEntries} ${t('entries')}`}
        />
        <SummaryCard
          title={t('totalExpenditure')}
          amount={formatCurrency(summary.totalExpenditure)}
          icon={<ReceiptIndianRupee />}
          colorClass="card-orange"
          subtitle={`${summary.totalExpenditureEntries} ${t('entries')}`}
        />
        <SummaryCard
          title={isDeficit ? t('deficit') : t('remainingBalance')}
          amount={isDeficit ? `-${formatCurrency(Math.abs(summary.balance))}` : formatCurrency(summary.balance)}
          icon={<WalletCards />}
          colorClass={isDeficit ? 'card-red' : 'card-blue'}
          subtitle={isDeficit ? t('expenditureExceeds') : t('availableFunds')}
        />
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-item">
          <Users className="stat-icon" />
          <div>
            <span className="stat-value">{summary.totalContributors}</span>
            <span className="stat-label">{t('contributors')}</span>
          </div>
        </div>
        <div className="stat-item">
          <TrendingUp className="stat-icon stat-green" />
          <div>
            <span className="stat-value">{summary.totalContributionEntries}</span>
            <span className="stat-label">{t('contributions')}</span>
          </div>
        </div>
        <div className="stat-item">
          <TrendingDown className="stat-icon stat-orange" />
          <div>
            <span className="stat-value">{summary.totalExpenditureEntries}</span>
            <span className="stat-label">{t('expenditures')}</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-grid">
        {/* Recent Contributions */}
        <div className="recent-section">
          <div className="section-header">
            <h2>{t('recentContributions')}</h2>
            <Link to="/contributions" className="view-all-link">{t('viewAll')} →</Link>
          </div>
          {summary.recentContributions.length > 0 ? (
            <div className="recent-list">
              {summary.recentContributions.map((c) => (
                <div key={c._id} className="recent-item">
                  <div className="recent-item-info">
                    <span className="recent-name">{c.contributorName}</span>
                    <span className="recent-date">{formatDate(c.contributionDate)}</span>
                  </div>
                  <span className="recent-amount amount-positive">
                    +{formatCurrency(c.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">{t('noContributions')}</p>
          )}
        </div>

        {/* Recent Expenditures */}
        <div className="recent-section">
          <div className="section-header">
            <h2>{t('recentExpenditures')}</h2>
            <Link to="/expenditures" className="view-all-link">{t('viewAll')} →</Link>
          </div>
          {summary.recentExpenditures.length > 0 ? (
            <div className="recent-list">
              {summary.recentExpenditures.map((e) => (
                <div key={e._id} className="recent-item">
                  <div className="recent-item-info">
                    <span className="recent-name">{e.reason}</span>
                    <span className="recent-date">{formatDate(e.expenseDate)}</span>
                  </div>
                  <span className="recent-amount amount-negative">
                    -{formatCurrency(e.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">{t('noExpenditures')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
