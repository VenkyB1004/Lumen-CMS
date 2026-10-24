import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../../services/api';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

const trendStyle = {
  Rising: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
  Steady: 'bg-amber-50 text-amber-800 border border-amber-200/80',
  Cooling: 'bg-rose-50 text-rose-800 border border-rose-200/80',
  'Insufficient data': 'bg-stone-100 text-stone-600 border border-stone-200',
};

const formatMetric = (value) => Number(value || 0).toLocaleString();

export default function TopicTrendsDashboard() {
  const [topics, setTopics] = useState([]);
  const [methodology, setMethodology] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [trend, setTrend] = useState('all');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await articleAPI.getTopicTrends();
        const data = response.data;
        if (!data?.success) throw new Error(data?.message || 'Could not load topic trends.');
        if (!cancelled) {
          setTopics(Array.isArray(data.topics) ? data.topics : []);
          setMethodology(data.trendBasis || '');
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'Could not load topic trends.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [retry]);

  const categories = useMemo(
    () => [...new Set(topics.flatMap((topic) => topic.categories || []))].sort(),
    [topics]
  );

  const filteredTopics = useMemo(
    () =>
      topics.filter((topic) => {
        const searchText = [
          topic.name,
          ...(topic.keywords || []),
          ...(topic.articles || []).map((article) => article.title),
        ]
          .join(' ')
          .toLowerCase();

        return (
          (!query.trim() || searchText.includes(query.trim().toLowerCase())) &&
          (category === 'all' || (topic.categories || []).includes(category)) &&
          (trend === 'all' || topic.trend === trend)
        );
      }),
    [topics, query, category, trend]
  );

  const counts = useMemo(
    () => ({
      rising: topics.filter((topic) => topic.trend === 'Rising').length,
      steady: topics.filter((topic) => topic.trend === 'Steady').length,
      cooling: topics.filter((topic) => topic.trend === 'Cooling').length,
      popular: topics.filter((topic) => topic.popular).length,
    }),
    [topics]
  );

  const statCards = [
    {
      title: 'Rising Topics',
      count: counts.rising,
      description: 'Topics with more published articles in the latest 7-day period.',
      color: 'emerald',
      icon: ArrowUpRight,
      bgBadge: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
      dotColor: 'bg-emerald-500',
    },
    {
      title: 'Steady Topics',
      count: counts.steady,
      description: 'Topics with similar publication frequency across both periods.',
      color: 'amber',
      icon: CheckCircle2,
      bgBadge: 'bg-amber-50 text-amber-800 border border-amber-200/80',
      dotColor: 'bg-amber-500',
    },
    {
      title: 'Cooling Topics',
      count: counts.cooling,
      description: 'Topics with fewer published articles in the latest 7-day period.',
      color: 'rose',
      icon: ArrowDownRight,
      bgBadge: 'bg-rose-50 text-rose-800 border border-rose-200/80',
      dotColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Refresh Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Editorial Intelligence</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Topic &amp; Trend Detection
          </h2>
          <p className="text-xs text-stone-500">
            Understand which subjects are gaining attention across published editorial articles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl bg-[#1A382B] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#254F3D] disabled:cursor-wait disabled:opacity-70"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh trends
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className="min-h-[140px] rounded-3xl border border-[#EDE8DF] bg-white p-5 shadow-xs transition hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${card.bgBadge}`}>
                  <span className={`h-2 w-2 rounded-full ${card.dotColor}`} />
                  {card.title}
                </span>
                <Icon
                  className={`h-4 w-4 ${
                    card.color === 'emerald'
                      ? 'text-emerald-700'
                      : card.color === 'amber'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                />
              </div>
              <p className="mt-3 font-serif text-3xl font-bold text-stone-900">
                {loading ? (
                  <span className="inline-block h-8 w-12 animate-pulse rounded bg-stone-100" />
                ) : (
                  card.count.toLocaleString()
                )}
              </p>
              <p className="mt-1 text-xs text-stone-500 leading-relaxed">{card.description}</p>
            </article>
          );
        })}
      </div>

      {/* Detected Topics Section */}
      <section className="overflow-hidden rounded-3xl border border-[#EDE8DF] bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-[#EDE8DF] px-6 py-4 sm:flex-row sm:items-center sm:justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-lg font-bold text-stone-900">Detected Topics</h3>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {loading ? 'Analyzing...' : `${filteredTopics.length} topics`}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search topics, keywords..."
                className="w-full sm:w-56 rounded-xl border border-[#EDE8DF] bg-[#FAF7F2] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#1A382B]"
              />
            </div>

            {/* Category Filter */}
            <label className="flex items-center gap-2 rounded-xl border border-[#EDE8DF] bg-[#FAF7F2] px-3 py-2 text-xs font-semibold text-stone-700">
              <SlidersHorizontal className="h-3.5 w-3.5 text-stone-500" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="min-w-0 bg-transparent text-xs font-semibold outline-none cursor-pointer text-stone-800"
              >
                <option value="all">All categories</option>
                {categories.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            {/* Trend Filter */}
            <label className="flex items-center gap-2 rounded-xl border border-[#EDE8DF] bg-[#FAF7F2] px-3 py-2 text-xs font-semibold text-stone-700">
              <select
                value={trend}
                onChange={(event) => setTrend(event.target.value)}
                className="min-w-0 bg-transparent text-xs font-semibold outline-none cursor-pointer text-stone-800"
              >
                <option value="all">All trends</option>
                <option value="Rising">Rising</option>
                <option value="Steady">Steady</option>
                <option value="Cooling">Cooling</option>
                <option value="Insufficient data">Insufficient data</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-20 text-xs font-medium text-stone-500">
            <LoaderCircle className="h-4 w-4 animate-spin text-[#1A382B]" />
            Analyzing published topics…
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <AlertTriangle className="mx-auto h-7 w-7 text-amber-600" />
            <p className="mt-2 text-xs font-semibold text-stone-800">{error}</p>
            <button
              onClick={() => setRetry((value) => value + 1)}
              className="mt-3 rounded-xl bg-[#1A382B] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#254F3D] transition"
            >
              Retry
            </button>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Search className="mx-auto h-7 w-7 text-stone-300" />
            <p className="mt-2 text-xs font-semibold text-stone-800">
              {topics.length ? 'No topics match these filters' : 'No published topics found'}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {topics.length
                ? 'Try another search or category.'
                : 'Topics will appear when published articles are available.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead className="bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-[#EDE8DF]">
                  <tr>
                    <th className="px-6 py-3.5">Topic / keywords</th>
                    <th className="px-4 py-3.5">Frequency</th>
                    <th className="px-4 py-3.5">Trend</th>
                    <th className="px-4 py-3.5">Engagement</th>
                    <th className="px-6 py-3.5">Related articles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE8DF] text-stone-700">
                  {filteredTopics.map((item) => (
                    <tr key={item.name} className="align-middle hover:bg-stone-50/70 transition">
                      <td className="max-w-[300px] px-6 py-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-stone-900 text-xs">{item.name}</p>
                          <span
                            title={
                              item.aiEnhanced
                                ? 'Gemini semantic analysis'
                                : 'Rule-based topic extraction'
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              item.aiEnhanced
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            <Bot className="h-3 w-3" />
                            {item.aiEnhanced ? 'Gemini' : 'Rule-based'}
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {(item.keywords || []).slice(0, 4).map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-md bg-[#FAF7F2] border border-[#EDE8DF] px-2 py-0.5 text-[11px] text-stone-600 font-mono"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        {item.summary && (
                          <p className="mt-1.5 text-[11px] leading-relaxed text-stone-500">
                            {item.summary}
                          </p>
                        )}
                        {item.aiExplanation && (
                          <p className="mt-1 text-[11px] leading-relaxed text-stone-400 italic">
                            {item.aiExplanation}
                          </p>
                        )}
                        {Boolean(item.popular) && (
                          <span className="mt-1 inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            Popular
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs">
                        <span className="font-bold text-stone-900">{item.recentArticles}</span>
                        <span className="text-stone-500"> recent</span>
                        <br />
                        <span className="text-[11px] text-stone-500">
                          {item.previousArticles} previous · {item.articleCount} total
                        </span>
                        {item.growthPercent !== null && item.growthPercent !== undefined && (
                          <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                            {Number(item.growthPercent) > 0 ? '+' : ''}
                            {item.growthPercent}% change
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            trendStyle[item.trend] || trendStyle['Insufficient data']
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                          {item.trend}
                        </span>
                        {Number(item.undatedArticles) > 0 && (
                          <p className="mt-1 text-[10px] text-stone-400">
                            {item.undatedArticles} undated
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs font-mono text-stone-700">
                        {Object.keys(item.engagement || {}).length ? (
                          Object.entries(item.engagement).map(([key, value]) => (
                            <span key={key} className="mr-2 whitespace-nowrap">
                              <strong className="text-stone-900 font-sans">
                                {formatMetric(value)}
                              </strong>{' '}
                              {key}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 font-sans text-xs">No metrics</span>
                        )}
                      </td>

                      <td className="max-w-[240px] px-6 py-4">
                        {item.articles && item.articles.length > 0 ? (
                          <div className="space-y-1">
                            {item.articles.slice(0, 2).map((article) => (
                              <Link
                                key={article._id || article.id}
                                to={`/browse/${article._id || article.id}`}
                                className="block truncate text-xs font-medium text-stone-800 hover:text-[#1A382B] hover:underline"
                              >
                                {article.title}
                              </Link>
                            ))}
                            {item.articles.length > 2 && (
                              <span className="text-[10px] text-stone-400 font-medium">
                                +{item.articles.length - 2} more articles
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400">No related articles</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="divide-y divide-[#EDE8DF] md:hidden">
              {filteredTopics.map((item) => (
                <article key={item.name} className="space-y-2.5 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-semibold text-stone-900 text-xs">{item.name}</h4>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.aiEnhanced
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          <Bot className="h-2.5 w-2.5" />
                          {item.aiEnhanced ? 'Gemini' : 'Rule-based'}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(item.keywords || []).slice(0, 3).map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded bg-[#FAF7F2] border border-[#EDE8DF] px-1.5 py-0.5 text-[10px] text-stone-600 font-mono"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        trendStyle[item.trend] || trendStyle['Insufficient data']
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    <strong className="text-stone-800">{item.recentArticles}</strong> recent ·{' '}
                    {item.previousArticles} previous · {item.articleCount} total
                  </p>
                  {item.articles && item.articles.length > 0 && (
                    <div className="space-y-1">
                      {item.articles.slice(0, 2).map((article) => (
                        <Link
                          key={article._id || article.id}
                          to={`/browse/${article._id || article.id}`}
                          className="block truncate text-xs text-stone-800 hover:text-[#1A382B] hover:underline"
                        >
                          {article.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Methodology Note */}
      {!loading && !error && methodology && (
        <p className="flex items-start gap-2 px-1 text-xs text-stone-500">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
          {methodology}
        </p>
      )}
    </div>
  );
}