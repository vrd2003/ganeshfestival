import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import useContributions from '../hooks/useContributions';
import Modal from '../components/Modal';
import ContributionForm from '../components/ContributionForm';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchFilter from '../components/SearchFilter';
import { showToast } from '../components/Toast';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useLanguage } from '../i18n';

const sortOptions = [
  { value: 'amount', label: 'Amount' },
  { value: 'contributionDate', label: 'Date' },
  { value: 'contributorName', label: 'Name' }
];

const Contributions = () => {
  const { t } = useLanguage();
  const {
    contributions,
    total,
    loading,
    filters,
    setFilters,
    addContribution,
    editContribution,
    removeContribution
  } = useContributions();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleAdd = async (data) => {
    await addContribution(data);
    setShowForm(false);
    showToast(t('contributionAdded'), 'success');
  };

  const handleEdit = async (data) => {
    await editContribution(editingItem._id, data);
    setEditingItem(null);
    showToast(t('contributionUpdated'), 'success');
  };

  const handleDelete = async () => {
    await removeContribution(deleteId);
    setDeleteId(null);
    showToast(t('contributionDeleted'), 'success');
  };

  return (
    <div className="page-container fade-in" id="contributions-page">
      <div className="page-header">
        <div>
          <h1>{t('contributions')}</h1>
          <p className="page-subtitle">{t('manageContributions')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} id="add-contribution-btn">
          <Plus /> {t('addContribution')}
        </button>
      </div>

      {/* Total Banner */}
      <div className="total-banner total-green">
        <span>{t('totalContribution')}</span>
        <span className="total-amount">{formatCurrency(total)}</span>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        filters={filters}
        onFilterChange={setFilters}
        sortOptions={sortOptions}
        placeholder={t('searchContributor')}
      />

      {/* Table */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : contributions.length > 0 ? (
        <div className="table-container">
          <table className="data-table" id="contributions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('contributorName')}</th>
                <th>{t('amount')}</th>
                <th>{t('date')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td>
                  <td className="name-cell">{c.contributorName}</td>
                  <td className="amount-cell amount-positive">{formatCurrency(c.amount)}</td>
                  <td>{formatDate(c.contributionDate)}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-icon btn-edit"
                      onClick={() => setEditingItem(c)}
                        title={t('edit')}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-icon btn-delete"
                      onClick={() => setDeleteId(c._id)}
                        title={t('delete')}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🙏</span>
          <h3>{t('noContributions')}</h3>
          <p>{t('addContribution')}</p>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={t('addContribution')}>
        <ContributionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={t('updateContribution')}>
        <ContributionForm
          onSubmit={handleEdit}
          onCancel={() => setEditingItem(null)}
          initialData={editingItem}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={`${t('delete')} ${t('contributions')}`}
        message={t('deleteQuestion')}
      />
    </div>
  );
};

export default Contributions;
