import { Link } from "react-router-dom";
import { formatLastUpdated } from "../../../utils/format";
import Spinner from "../../ui/Spinner";

export default function SidebarActions({
  onRefresh,
  onLogout,
  onMobileClose,
  refreshing,
  lastUpdated,
}) {
  return (
    <div className="space-y-1 border-t border-piggy-border pt-3 mt-3" aria-busy={refreshing} aria-live="polite">
      <Link
        to="/settings"
        onClick={() => onMobileClose?.()}
        className="nav-item-accent"
      >
        Edit preferences
      </Link>
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="nav-item disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent disabled:hover:bg-transparent disabled:hover:text-piggy-gray"
      >
        {refreshing && <Spinner size="sm" />}
        {refreshing ? "Refreshing brief…" : "Refresh Brief"}
      </button>
      <button type="button" onClick={onLogout} className="nav-item">
        Log out
      </button>
      {lastUpdated && (
        <p className="px-3 pt-1 text-xs text-piggy-gray">
          Updated {formatLastUpdated(lastUpdated)}
        </p>
      )}
    </div>
  );
}
