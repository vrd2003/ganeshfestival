import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { useLanguage } from '../i18n';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <TriangleAlert />
        </div>
        <h3>{title || t('confirmDelete')}</h3>
        <p>{message || t('deleteQuestion')}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onClose} id="confirm-cancel">
            {t('cancel')}
          </button>
          <button className="btn btn-danger" onClick={onConfirm} id="confirm-delete">
            {t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
