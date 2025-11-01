import { Link } from "react-router-dom";
import "../../css/pagination.css";

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}) {
  const pageNum = parseInt(currentPage);
  const queryString = searchParams ? `?${searchParams.toString()}` : "";
  return (
    <div className="pagination">
      {pageNum > 1 && (
        <Link
          to={`${basePath}/${pageNum - 1}${queryString}`}
          className="pagination-button"
        >
          ← Previous Page
        </Link>
      )}
      <span className="pagination-info">
        Page {pageNum} of {totalPages}
      </span>
      {pageNum < totalPages && (
        <Link
          to={`${basePath}/${pageNum + 1}${queryString}`}
          className="pagination-button"
        >
          Next Page →
        </Link>
      )}
    </div>
  );
}
