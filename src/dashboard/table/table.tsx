import React from "react";
import { Portfolio, Asset } from "../../services/api.service";
import "./table.scss";

const Table: React.FC<{
  portfolio: Portfolio;
  assets: Asset[];
  columns: string[];
}> = ({ portfolio, assets, columns }) => {
  if (!portfolio || !assets.length) {
    return (
      <div className="table-container">
        <div className="no-data">No portfolio data available</div>
      </div>
    );
  }
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {portfolio.positions && portfolio.positions.length > 0 ? (
            portfolio.positions.map((position) => {
              const asset = assets.find((a) => a.id === position.asset);
              return (
                <tr key={position.id}>
                  <td>{asset?.name || "Unknown"}</td>
                  <td>
                    <span className={`indicator ${asset?.type}`} />
                    {asset?.type || "Unknown"}
                  </td>
                  <td>{position.quantity}</td>
                  <td>${position.price.toFixed(2)}</td>
                  <td>${(position.quantity * position.price).toFixed(2)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-data-cell">
                No positions available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
