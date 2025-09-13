import React from 'react';

/**
 * Componente Table centralizado con estilos consistentes
 */
const Table = ({
  columns = [],
  data = [],
  className = '',
  ...props
}) => {
  const tableClasses = [
    'table',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="table-container">
      <table className={tableClasses} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.align === 'right' ? 'text-right' : ''}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.align === 'right' ? 'text-right' : ''}>
                  {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
