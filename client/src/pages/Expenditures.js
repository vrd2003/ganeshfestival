import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import useExpenditures from '../hooks/useExpenditures';
import Modal from '../components/Modal';
import ExpenditureForm from '../components/ExpenditureForm';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchFilter from '../components/SearchFilter';
import ReceiptViewer from '../components/ReceiptViewer';
import { showToast } from '../components/Toast';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useLanguage } from '../i18n';

const sortOptions = [
  { value: 'amount', label: 'Amount' },
  { value: 'expenseDate', label: 'Date' },
  { value: 'reason', label: 'Reason' }
];

const Expenditures = () => {
  const { t } = useLanguage();
  const {
    expenditures,
    total,
    loading,
    filters,
    setFilters,
    addExpenditure,
    editExpenditure,
    removeExpenditure
  } = useExpenditures();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const handleAdd = async (formData) => {
    await addExpenditure(formData);
    setShowForm(false);
    showToast(t('expenditureAdded'), 'success');
  };

  const handleEdit = async (formData) => {
    await editExpenditure(editingItem._id, formData);
    setEditingItem(null);
    showToast(t('expenditureUpdated'), 'success');
  };

  const handleDelete = async () => {
    await removeExpenditure(deleteId);
    setDeleteId(null);
    showToast(t('expenditureDeleted'), 'success');
  };

  const handleViewReceipt = (exp) => {
    if (exp.receiptFileType === 'application/pdf') {
      window.open(exp.receiptUrl, '_blank');
    } else {
      setViewingReceipt(exp);
    }
  };

  return (
    <div className="page-container fade-in" id="expenditures-page">
      <div className="page-header">
        <div>
          <h1>{t('expenditures')}</h1>
          <p className="page-subtitle">{t('manageExpenditures')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} id="add-expenditure-btn">
          <Plus /> {t('addExpenditure')}
        </button>
      </div>

      {/* Total Banner */}
      <div className="total-banner total-orange">
        <span>{t('totalExpenditure')}</span>
        <span className="total-amount">{formatCurrency(total)}</span>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        filters={filters}
        onFilterChange={setFilters}
        sortOptions={sortOptions}
        placeholder={t('searchReason')}
      />

      {/* Table */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : expenditures.length > 0 ? (
        <div className="table-container">
          <table className="data-table" id="expenditures-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('reason')}</th>
                <th>{t('amount')}</th>
                <th>{t('date')}</th>
                <th>{t('receipt')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {expenditures.map((e, i) => (
                <tr key={e._id}>
                  <td>{i + 1}</td>
                  <td className="name-cell">{e.reason}</td>
                  <td className="amount-cell amount-negative">{formatCurrency(e.amount)}</td>
                  <td>{formatDate(e.expenseDate)}</td>
                  <td>
                    {e.receiptUrl ? (
                      <button
                        className="btn btn-sm btn-receipt"
                        onClick={() => handleViewReceipt(e)}
                      >
                        <Eye /> {t('view')}
                      </button>
                    ) : (
                      <span className="no-receipt">—</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-icon btn-edit"
                      onClick={() => setEditingItem(e)}
                      title={t('edit')}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-icon btn-delete"
                      onClick={() => setDeleteId(e._id)}
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
          <span className="empty-icon">📋</span>
          <h3>{t('noExpenditures')}</h3>
          <p>{t('addExpenditure')}</p>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={t('addExpenditure')}>
        <ExpenditureForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={t('updateExpenditure')}>
        <ExpenditureForm
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
        title={`${t('delete')} ${t('expenditures')}`}
        message={t('deleteQuestion')}
      />

      {/* Receipt Viewer */}
      <ReceiptViewer
        isOpen={!!viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        receiptUrl={viewingReceipt?.receiptUrl}
        fileName={viewingReceipt?.receiptFileName}
        fileType={viewingReceipt?.receiptFileType}
      />
    </div>
  );
};

export default Expenditures;
