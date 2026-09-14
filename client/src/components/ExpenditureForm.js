import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { toInputDate } from '../utils/formatters';
import { useLanguage } from '../i18n';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ExpenditureForm = ({ onSubmit, onCancel, initialData }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    reason: initialData?.reason || '',
    amount: initialData?.amount || '',
    expenseDate: initialData?.expenseDate ? toInputDate(initialData.expenseDate) : ''
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.reason.trim()) errs.reason = t('reasonRequired');
    if (!formData.amount || Number(formData.amount) < 1) errs.amount = t('amountRequired');
    if (!formData.expenseDate) errs.expenseDate = t('dateRequired');
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errs.file = t('fileTypes');
      }
      if (file.size > MAX_SIZE) {
        errs.file = t('fileSize');
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('reason', formData.reason.trim());
      fd.append('amount', Number(formData.amount));
      fd.append('expenseDate', formData.expenseDate);
      if (file) {
        fd.append('receipt', file);
      }
      await onSubmit(fd);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || t('failedSave') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} id="expenditure-form">
      <div className="form-group">
        <label htmlFor="reason">{t('reason')}</label>
        <input
          type="text"
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder={t('enterReason')}
        />
        {errors.reason && <span className="form-error">{errors.reason}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="expAmount">{t('amount')} (₹)</label>
        <input
          type="number"
          id="expAmount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder={t('enterAmount')}
          min="1"
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="expenseDate">{t('expenditures')} {t('date')}</label>
        <input
          type="date"
          id="expenseDate"
          value={formData.expenseDate}
          onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
        />
        {errors.expenseDate && <span className="form-error">{errors.expenseDate}</span>}
      </div>

      <div className="form-group">
        <label>{t('receiptBill')}</label>
        <div className="file-upload-area">
          <input
            type="file"
            id="receiptFile"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="receiptFile" className="file-upload-label">
            <CloudUpload className="upload-icon" />
            <span>{file ? file.name : t('chooseFile')}</span>
            <span className="file-hint">{t('supportedFiles')}</span>
          </label>
        </div>
        {initialData?.receiptFileName && !file && (
          <span className="existing-file">{t('current')}: {initialData.receiptFileName}</span>
        )}
        {errors.file && <span className="form-error">{errors.file}</span>}
      </div>

      {errors.submit && <div className="form-error form-error-general">{errors.submit}</div>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {t('cancel')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t('save') : initialData ? t('updateExpenditure') : t('addExpenditure')}
        </button>
      </div>
    </form>
  );
};

export default ExpenditureForm;
