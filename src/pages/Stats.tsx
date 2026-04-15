import { useState, useEffect, useCallback } from 'react';
import { fetchStats, fetchRandomQuote } from '../api';
import type { Stats as StatsData, Quote, ApiError } from '../api';
import { logger } from '../utils/logger';

/**
 * Statistics page — displays task analytics and motivational quotes.
 *
 * Key change from localStorage version:
 * - Stats are computed by the backend using SQL aggregates (fast, accurate)
 * - Quotes come through the Rails proxy (cached for 10 min, no CORS issues)
 * - No longer receives `tasks` as props — fully self-contained with its own data
 */
export default function Stats() {
  // Stats state
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Quote state
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  /**
   * Fetch stats from the API on mount.
   * Stats are always fresh from the DB — no stale client-side computation.
   */
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const data = await fetchStats();
        setStats(data);
        logger.info('Stats loaded', { total: data.total });
      } catch (err) {
        const apiErr = err as ApiError;
        setStatsError(apiErr.message || 'Failed to load stats');
        logger.error('Failed to fetch stats', err as Error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  /**
   * Fetch a quote from the API.
   * @param force - true when user clicks refresh (skip backend cache),
   *                false on initial page load (use cached quote if available)
   */
  const loadQuote = useCallback(async (force = false) => {
    try {
      setQuoteLoading(true);
      setQuoteError(null);
      const data = await fetchRandomQuote(force);
      setQuote(data);
    } catch (err) {
      const apiErr = err as ApiError;
      setQuoteError(apiErr.message || 'Failed to fetch quote');
      logger.error('Failed to fetch quote', err as Error);
    } finally {
      setQuoteLoading(false);
    }
  }, []);

  // On mount: load from cache (fast)
  useEffect(() => {
    loadQuote(false);
  }, [loadQuote]);

  // Show full-page loader while stats are loading
  if (statsLoading) {
    return (
      <div className="page-container">
        <div className="container stats-container">
          <div className="loading-container">
            <div className="quote-spinner"></div>
            <p>Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if stats failed to load
  if (statsError || !stats) {
    return (
      <div className="page-container">
        <div className="container stats-container">
          <div className="quote-error">
            <p>{statsError || 'Failed to load stats'}</p>
            <button onClick={() => window.location.reload()} className="quote-retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container stats-container">
        <h1 className="title">Task Statistics</h1>
        <p className="subtitle">Track your productivity and progress</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        <div className="progress-section">
          <h2 className="section-title">Overall Progress</h2>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </div>

        <div className="motivation-section">
          <h2 className="section-title">Daily Motivation</h2>
          <div className="quote-box">
            {quoteLoading && (
              <div className="quote-loading">
                <div className="quote-spinner"></div>
                <p>Loading inspiration...</p>
              </div>
            )}

            {quoteError && (
              <div className="quote-error">
                <p>Failed to fetch quote from API</p>
                <button onClick={() => loadQuote(true)} className="quote-retry-btn">
                  Retry
                </button>
              </div>
            )}

            {quote && !quoteLoading && !quoteError && (
              <div className="quote-display">
                <div className="quote-icon">💡</div>
                <p className="quote-message">"{quote.q}"</p>
                <p className="quote-attribution">— {quote.a}</p>
                <button onClick={() => loadQuote(true)} className="quote-refresh-btn" title="Get new quote">
                  ↻
                </button>
              </div>
            )}
          </div>
        </div>

        {stats.recentTasks.length > 0 && (
          <div className="recent-section">
            <h2 className="section-title">Recent Tasks</h2>
            <ul className="recent-tasks-list">
              {stats.recentTasks.map((task) => (
                <li key={task.id} className="recent-task-item">
                  <span className={task.completed ? 'completed' : ''}>
                    {task.completed ? '✓' : '○'} {task.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {stats.total === 0 && (
          <div className="empty-stats">
            <p>No tasks yet! Start adding tasks to see your statistics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
