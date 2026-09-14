import React from 'react';
import { X, Download } from 'lucide-react';
import { useLanguage } from '../i18n';

const ReceiptViewer = ({ isOpen, onClose, receiptUrl, fileName, fileType }) => {
  const { t } = useLanguage();
  if (!isOpen || !receiptUrl) return null;

  const fullUrl = receiptUrl.startsWith('http') ? receiptUrl : receiptUrl;
  const isPdf = fileType === 'application/pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName || 'receipt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isPdf) {
    // Open PDF in new tab
    window.open(fullUrl, '_blank');
    onClose();
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="receipt-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-header">
          <h3>{fileName || 'Receipt'}</h3>
          <div className="receipt-actions">
            <button className="btn btn-icon" onClick={handleDownload} title="Download">
              <Download />
            </button>
            <button className="btn btn-icon" onClick={onClose} title="Close">
              <X />
            </button>
          </div>
        </div>
        <div className="receipt-body">
          <img src={fullUrl} alt={t('receiptAlt')} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptViewer;
