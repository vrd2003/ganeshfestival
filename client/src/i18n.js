import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard', contributions: 'Contributions', expenditures: 'Expenditures', reports: 'Reports',
    financialManager: 'Financial Manager', festivalOverview: 'Ganesh Festival Financial Overview',
    totalContribution: 'Total Contribution', totalExpenditure: 'Total Expenditure', remainingBalance: 'Remaining Balance',
    deficit: 'Deficit', availableFunds: 'Available funds', entries: 'entries', contributors: 'Contributors',
    recentContributions: 'Recent Contributions', recentExpenditures: 'Recent Expenditures', viewAll: 'View All',
    noContributions: 'No contributions yet', noExpenditures: 'No expenditures yet', loadingDashboard: 'Loading dashboard...',
    completeRecords: 'Complete financial records', contributionReport: 'Contribution Report', expenditureReport: 'Expenditure Report',
    contributor: 'Contributor', contributorName: 'Contributor Name', reason: 'Reason', amount: 'Amount', date: 'Date', receipt: 'Receipt',
    exportCsv: 'Export CSV', generatePdf: 'Generate PDF', noContributionsReport: 'No contributions to report',
    noExpendituresReport: 'No expenditures to report', language: 'Language', english: 'English', marathi: 'मराठी',
    generatedOn: 'Generated on', financialSummary: 'Financial Summary', balance: 'Balance', total: 'Total',
    reportTitle: 'Ganesh Festival Financial Report', expenditureExceeds: 'Expenditure exceeds collection',
    contributionAdded: 'Contribution added successfully!', contributionUpdated: 'Contribution updated successfully!', contributionDeleted: 'Contribution deleted successfully!', expenditureAdded: 'Expenditure added successfully!', expenditureUpdated: 'Expenditure updated successfully!', expenditureDeleted: 'Expenditure deleted successfully!', addContribution: 'Add Contribution', addExpenditure: 'Add Expenditure', manageContributions: 'Manage festival contributions', manageExpenditures: 'Manage festival expenses', searchContributor: 'Search by contributor name...', searchReason: 'Search by expense reason...', nameRequired: 'Contributor name is required', reasonRequired: 'Expense reason is required', amountRequired: 'Amount must be at least ₹1', dateRequired: 'Date is required', enterContributor: 'Enter contributor name', enterAmount: 'Enter amount', enterReason: 'Enter expense reason', save: 'Saving...', cancel: 'Cancel', updateContribution: 'Update Contribution', updateExpenditure: 'Update Expenditure', receiptBill: 'Receipt / Bill', chooseFile: 'Choose File', supportedFiles: 'Supported: JPG, JPEG, PNG, PDF (Max 5MB)', current: 'Current', view: 'View', actions: 'Actions', defaultSort: 'Default Sort', descending: 'Descending', ascending: 'Ascending', startDate: 'Start Date', endDate: 'End Date', to: 'to', edit: 'Edit', delete: 'Delete', confirmDelete: 'Confirm Delete', deleteQuestion: 'Are you sure you want to delete this record? This action cannot be undone.', download: 'Download', close: 'Close', receiptAlt: 'Receipt', failedSave: 'Failed to save', fileTypes: 'Only JPG, JPEG, PNG, and PDF files are allowed', fileSize: 'File size must be less than 5MB',
    failedReport: 'Failed to load report data', csvSuccess: 'CSV exported successfully!', pdfSuccess: 'PDF ready to print!'
  },
  mr: {
    dashboard: 'डॅशबोर्ड', contributions: 'वर्गणी', expenditures: 'खर्च', reports: 'अहवाल',
    financialManager: 'आर्थिक व्यवस्थापन', festivalOverview: 'गणेशोत्सव आर्थिक आढावा',
    totalContribution: 'एकूण वर्गणी', totalExpenditure: 'एकूण खर्च', remainingBalance: 'शिल्लक रक्कम',
    deficit: 'तूट', availableFunds: 'उपलब्ध निधी', entries: 'नोंदी', contributors: 'वर्गणीदार',
    recentContributions: 'अलीकडील वर्गणी', recentExpenditures: 'अलीकडील खर्च', viewAll: 'सर्व पहा',
    noContributions: 'अद्याप वर्गणी नाही', noExpenditures: 'अद्याप खर्च नाही', loadingDashboard: 'डॅशबोर्ड लोड होत आहे...',
    completeRecords: 'संपूर्ण आर्थिक नोंदी', contributionReport: 'वर्गणी अहवाल', expenditureReport: 'खर्च अहवाल',
    contributor: 'वर्गणीदार', contributorName: 'वर्गणीदाराचे नाव', reason: 'कारण', amount: 'रक्कम', date: 'दिनांक', receipt: 'पावती',
    exportCsv: 'CSV निर्यात', generatePdf: 'PDF तयार करा', noContributionsReport: 'अहवालासाठी वर्गणी नाही',
    noExpendituresReport: 'अहवालासाठी खर्च नाही', language: 'भाषा', english: 'English', marathi: 'मराठी',
    generatedOn: 'तयार दिनांक', financialSummary: 'आर्थिक सारांश', balance: 'शिल्लक', total: 'एकूण',
    reportTitle: 'गणेशोत्सव आर्थिक अहवाल', expenditureExceeds: 'खर्च वर्गणीपेक्षा जास्त आहे',
    contributionAdded: 'वर्गणी यशस्वीरित्या जोडली!', contributionUpdated: 'वर्गणी यशस्वीरित्या अद्यतनित केली!', contributionDeleted: 'वर्गणी यशस्वीरित्या हटवली!', expenditureAdded: 'खर्च यशस्वीरित्या जोडला!', expenditureUpdated: 'खर्च यशस्वीरित्या अद्यतनित केला!', expenditureDeleted: 'खर्च यशस्वीरित्या हटवला!', addContribution: 'वर्गणी जोडा', addExpenditure: 'खर्च जोडा', manageContributions: 'गणेशोत्सव वर्गणी व्यवस्थापन', manageExpenditures: 'गणेशोत्सव खर्च व्यवस्थापन', searchContributor: 'वर्गणीदाराच्या नावाने शोधा...', searchReason: 'खर्चाच्या कारणाने शोधा...', nameRequired: 'वर्गणीदाराचे नाव आवश्यक आहे', reasonRequired: 'खर्चाचे कारण आवश्यक आहे', amountRequired: 'रक्कम किमान ₹१ असावी', dateRequired: 'दिनांक आवश्यक आहे', enterContributor: 'वर्गणीदाराचे नाव लिहा', enterAmount: 'रक्कम लिहा', enterReason: 'खर्चाचे कारण लिहा', save: 'जतन होत आहे...', cancel: 'रद्द करा', updateContribution: 'वर्गणी अद्यतनित करा', updateExpenditure: 'खर्च अद्यतनित करा', receiptBill: 'पावती / बिल', chooseFile: 'फाइल निवडा', supportedFiles: 'समर्थित: JPG, JPEG, PNG, PDF (कमाल 5MB)', current: 'सध्याची', view: 'पहा', actions: 'कृती', defaultSort: 'मूळ क्रमवारी', descending: 'उतरता क्रम', ascending: 'चढता क्रम', startDate: 'सुरुवातीचा दिनांक', endDate: 'शेवटचा दिनांक', to: 'ते', edit: 'संपादित करा', delete: 'हटवा', confirmDelete: 'हटवण्याची पुष्टी', deleteQuestion: 'हा रेकॉर्ड हटवायचा आहे का? ही कृती पूर्ववत करता येणार नाही.', download: 'डाउनलोड', close: 'बंद करा', receiptAlt: 'पावती', failedSave: 'जतन करता आले नाही', fileTypes: 'फक्त JPG, JPEG, PNG आणि PDF फाइल्स स्वीकारल्या जातात', fileSize: 'फाइलचा आकार 5MB पेक्षा कमी असावा',
    failedReport: 'अहवाल लोड करता आला नाही', csvSuccess: 'CSV यशस्वीरित्या निर्यात!', pdfSuccess: 'PDF प्रिंटसाठी तयार आहे!'
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  };
  const value = { language, setLanguage: changeLanguage, t: (key) => translations[language][key] || translations.en[key] || key };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
