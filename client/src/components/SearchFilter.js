import React from 'react';
import { Search, ListFilter, ArrowDownUp } from 'lucide-react';
import { useLanguage } from '../i18n';

const SearchFilter = ({ filters, onFilterChange, sortOptions, placeholder }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="search-filter-bar" id="search-filter-bar">
      <div className="search-box">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder={placeholder || t('searchContributor')}
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          aria-label={placeholder || t('searchContributor')}
          id="search-input"
        />
      </div>

      <div className="filter-group">
        <ListFilter className="filter-icon" />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          placeholder={t('startDate')}
          aria-label={t('startDate')}
          id="filter-start-date"
        />
        <span className="date-separator">{t('to')}</span>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder={t('endDate')}
          aria-label={t('endDate')}
          id="filter-end-date"
        />
      </div>

      <div className="sort-group">
        <ArrowDownUp className="sort-icon" />
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          aria-label={t('date')}
          id="sort-by"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.sortOrder}
          onChange={(e) => handleChange('sortOrder', e.target.value)}
          aria-label={t('sortOrder') || 'Sort order'}
          id="sort-order"
        >
          <option value="desc">{t('descending')}</option>
          <option value="asc">{t('ascending')}</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
