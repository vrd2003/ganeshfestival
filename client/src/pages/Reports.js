import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { fetchContributions, fetchExpenditures, fetchDashboardSummary } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { sortRecords } from '../utils/sorting';
import { showToast } from '../components/Toast';
import { useLanguage } from '../i18n';

const Reports = () => {
  const [contributions, setContributions] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [summary, setSummary] = useState({ totalContribution: 0, totalExpenditure: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contRes, expRes, dashRes] = await Promise.all([
          fetchContributions({}),
          fetchExpenditures({}),
          fetchDashboardSummary()
        ]);
        setContributions(sortRecords(contRes.data.data, 'contributionDate', 'asc'));
        setExpenditures(sortRecords(expRes.data.data, 'expenseDate', 'asc'));
        setSummary(dashRes.data.data);
      } catch (err) {
        showToast(t('failedReport'), 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [t]);

  const exportCSV = () => {
    try {
      let csv = `${t('reportTitle')}\n\n`;

      // Contributions
      csv += `${t('contributions').toUpperCase()}\n`;
      csv += `${t('contributor')},${t('amount')},${t('date')}\n`;
      contributions.forEach((c) => {
        csv += `"${c.contributorName}",${c.amount},"${formatDate(c.contributionDate)}"\n`;
      });
      csv += `\n${t('totalContribution')},${summary.totalContribution}\n\n`;

      // Expenditures
      csv += `${t('expenditures').toUpperCase()}\n`;
      csv += `${t('reason')},${t('amount')},${t('date')},${t('receipt')}\n`;
      expenditures.forEach((e) => {
        csv += `"${e.reason}",${e.amount},"${formatDate(e.expenseDate)}","${e.receiptFileName || 'N/A'}"\n`;
      });
      csv += `\n${t('totalExpenditure')},${summary.totalExpenditure}\n\n`;

      // Summary
      csv += `${t('financialSummary').toUpperCase()}\n`;
      csv += `${t('totalContribution')},${summary.totalContribution}\n`;
      csv += `${t('totalExpenditure')},${summary.totalExpenditure}\n`;
      csv += `${t('balance')},${summary.balance}\n`;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ganesh-festival-report-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      showToast(t('csvSuccess'), 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    }
  };

  const exportPDF = () => {
    try {
      const currency = (value) => formatCurrency(value);
      const contributionsByDate = [...contributions].sort((a, b) => String(a.contributionDate || '').localeCompare(String(b.contributionDate || '')));
      const expendituresByDate = [...expenditures].sort((a, b) => String(a.expenseDate || '').localeCompare(String(b.expenseDate || '')));
      const contributionRows = contributionsByDate.map((item, index) => `<tr><td>${index + 1}</td><td>${item.contributorName}</td><td>${currency(item.amount)}</td><td>${formatDate(item.contributionDate)}</td></tr>`).join('');
      const expenditureRows = expendituresByDate.map((item, index) => `<tr><td>${index + 1}</td><td>${item.reason}</td><td>${currency(item.amount)}</td><td>${formatDate(item.expenseDate)}</td></tr>`).join('');
      const printFrame = document.createElement('iframe');
      printFrame.setAttribute('title', t('reportTitle'));
      printFrame.style.position = 'fixed';
      printFrame.style.right = '100%';
      printFrame.style.bottom = '100%';
      printFrame.style.width = '1px';
      printFrame.style.height = '1px';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);

      const printDocument = printFrame.contentDocument;
      printDocument.open();
      printDocument.write(`<!doctype html><html lang="${language}"><head><meta charset="utf-8"><title>${t('reportTitle')}</title><style>@font-face{font-family:NotoDevanagari;src:url('${window.location.origin}/fonts/NotoSansDevanagari.woff')}body{font-family:NotoDevanagari,Arial,sans-serif;color:#1f2937;padding:28px}h1{text-align:center;color:#ea580c}h2{margin-top:28px;color:#374151}p{text-align:center;color:#6b7280}table{border-collapse:collapse;width:100%;margin-top:10px}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}th{background:#fed7aa}td:nth-child(1),td:nth-child(3){text-align:right}.summary{margin-top:28px;max-width:480px;margin-left:auto}.summary div{display:flex;justify-content:space-between;padding:7px;border-bottom:1px solid #e5e7eb}@media print{body{padding:0}}</style></head><body><h1>${t('reportTitle')}</h1><p>${t('generatedOn')}: ${new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}</p><h2>${t('contributions')}</h2><table><thead><tr><th>#</th><th>${t('contributor')}</th><th>${t('amount')}</th><th>${t('date')}</th></tr></thead><tbody>${contributionRows}</tbody></table><h2>${t('expenditures')}</h2><table><thead><tr><th>#</th><th>${t('reason')}</th><th>${t('amount')}</th><th>${t('date')}</th></tr></thead><tbody>${expenditureRows}</tbody></table><div class="summary"><h2>${t('financialSummary')}</h2><div><strong>${t('totalContribution')}</strong><span>${currency(summary.totalContribution)}</span></div><div><strong>${t('totalExpenditure')}</strong><span>${currency(summary.totalExpenditure)}</span></div><div><strong>${summary.balance < 0 ? t('deficit') : t('remainingBalance')}</strong><span>${currency(Math.abs(summary.balance))}</span></div></div></body></html>`);
      printDocument.close();
      const printWhenReady = () => {
        const printWindow = printFrame.contentWindow;
        const finish = () => {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => printFrame.remove(), 1000);
        };
        if (printDocument.fonts?.ready) printDocument.fonts.ready.then(finish);
        else finish();
      };
      setTimeout(printWhenReady, 300);
      showToast(t('pdfSuccess'), 'success');
    } catch (err) {
      showToast(err.message || 'Failed to export PDF', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"><div className="spinner"></div><p>Generating reports...</p></div>
      </div>
    );
  }

  const isDeficit = summary.balance < 0;

  return (
    <div className="page-container fade-in" id="reports-page">
      <div className="page-header">
        <div>
          <h1>{t('reports')}</h1>
          <p className="page-subtitle">{t('completeRecords')}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportCSV} id="export-csv-btn">
            <Download /> {t('exportCsv')}
          </button>
          <button className="btn btn-primary" onClick={exportPDF} id="export-pdf-btn">
            <FileText /> {t('generatePdf')}
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="report-summary">
        <div className="report-summary-item report-green">
          <span>{t('totalContribution')}</span>
          <span className="report-amount">{formatCurrency(summary.totalContribution)}</span>
        </div>
        <div className="report-summary-item report-orange">
          <span>{t('totalExpenditure')}</span>
          <span className="report-amount">{formatCurrency(summary.totalExpenditure)}</span>
        </div>
        <div className={`report-summary-item ${isDeficit ? 'report-red' : 'report-blue'}`}>
          <span>{isDeficit ? t('deficit') : t('remainingBalance')}</span>
          <span className="report-amount">
            {isDeficit ? `-${formatCurrency(Math.abs(summary.balance))}` : formatCurrency(summary.balance)}
          </span>
        </div>
      </div>

      {/* Contribution Report */}
      <div className="report-section">
        <h2>{t('contributionReport')}</h2>
        {contributions.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('contributor')}</th>
                  <th>{t('amount')}</th>
                  <th>{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c, i) => (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td>{c.contributorName}</td>
                    <td className="amount-cell amount-positive">{formatCurrency(c.amount)}</td>
                    <td>{formatDate(c.contributionDate)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>{t('totalContribution')}</strong></td>
                  <td className="amount-cell"><strong>{formatCurrency(summary.totalContribution)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="empty-message">{t('noContributionsReport')}</p>
        )}
      </div>

      {/* Expenditure Report */}
      <div className="report-section">
        <h2>{t('expenditureReport')}</h2>
        {expenditures.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('reason')}</th>
                  <th>{t('amount')}</th>
                  <th>{t('date')}</th>
                  <th>{t('receipt')}</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((e, i) => (
                  <tr key={e._id}>
                    <td>{i + 1}</td>
                    <td>{e.reason}</td>
                    <td className="amount-cell amount-negative">{formatCurrency(e.amount)}</td>
                    <td>{formatDate(e.expenseDate)}</td>
                    <td>{e.receiptFileName || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>{t('totalExpenditure')}</strong></td>
                  <td className="amount-cell"><strong>{formatCurrency(summary.totalExpenditure)}</strong></td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="empty-message">{t('noExpendituresReport')}</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
