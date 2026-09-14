import React, { useState } from 'react';
import { toInputDate } from '../utils/formatters';
import { useLanguage } from '../i18n';

const ContributionForm = ({ onSubmit, onCancel, initialData }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    contributorName: initialData?.contributorName || '',
    amount: initialData?.amount || '',
    contributionDate: initialData?.contributionDate
      ? toInputDate(initialData.contributionDate)
      : ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.contributorName.trim()) errs.contributorName = t('nameRequired');
    if (!formData.amount || Number(formData.amount) < 1) errs.amount = t('amountRequired');
    if (!formData.contributionDate) errs.contributionDate = t('dateRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        contributorName: formData.contributorName.trim(),
        amount: Number(formData.amount),
        contributionDate: formData.contributionDate
      });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || t('failedSave') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} id="contribution-form">
      <div className="form-group">
        <label htmlFor="contributorName">{t('contributorName')}</label>
        <input
          type="text"
          id="contributorName"
          value={formData.contributorName}
          onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
          placeholder={t('enterContributor')}
        />
        {errors.contributorName && <span className="form-error">{errors.contributorName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="amount">{t('amount')} (₹)</label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder={t('enterAmount')}
          min="1"
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="contributionDate">{t('contributions')} {t('date')}</label>
        <input
          type="date"
          id="contributionDate"
          value={formData.contributionDate}
          onChange={(e) => setFormData({ ...formData, contributionDate: e.target.value })}
        />
        {errors.contributionDate && <span className="form-error">{errors.contributionDate}</span>}
      </div>

      {errors.submit && <div className="form-error form-error-general">{errors.submit}</div>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {t('cancel')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t('save') : initialData ? t('updateContribution') : t('addContribution')}
        </button>
      </div>
    </form>
  );
};

export default ContributionForm;
