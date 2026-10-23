import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  LayoutGrid,
  Search,
  PenLine,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Filter,
  Eye,
  Clock,
  ThumbsUp,
} from 'lucide-react';

/**
 * Home Page View
 */
export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12 space-y-8 sm:space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#DCE8DF] bg-gradient-to-br from-white via-white to-emerald-50/80 p-6 shadow-sm shadow-emerald-950/[0.04] sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl space-y-5 sm:space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-900">
          <Sparkles className="w-3.5 h-3.5 text-[#D97736]" />
          Editorial Content & Knowledge Platform
        </div>

        <h1 className="max-w-3xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          Where Thoughtful Writing Meets Interactive Knowledge
        </h1>

        <p className="max-w-2xl text-sm font-normal leading-relaxed text-stone-600 sm:text-base">
          Lumen is an editorial publishing platform designed for curious
          readers, subject matter authors, and editorial teams.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1D4936] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#153A2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4936]"
            >
              <span>Go to My Profile ({user?.role})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1D4936] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#153A2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4936]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="inline-flex min-h-11 items-center rounded-xl border border-[#DCE8DF] bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4936]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
      </div>

      {/* Platform Pillars */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <div className="rounded-2xl border border-[#DCE8DF] bg-white p-5 shadow-sm shadow-emerald-950/[0.03] sm:p-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1A382B] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>

          <h2 className="mt-4 font-serif text-lg font-bold text-stone-900">
            In-Depth Articles
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Curated essays, technical deep-dives, and investigative science
            journalism written by domain experts.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE8DF] bg-white p-5 shadow-sm shadow-emerald-950/[0.03] sm:p-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D97736] flex items-center justify-center font-bold">
            <PenLine className="w-5 h-5" />
          </div>

          <h2 className="mt-4 font-serif text-lg font-bold text-stone-900">
            Interactive Knowledge
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Test and consolidate your understanding with article-aligned
            quizzes and concept checkpoints.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE8DF] bg-white p-5 shadow-sm shadow-emerald-950/[0.03] sm:p-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h2 className="mt-4 font-serif text-lg font-bold text-stone-900">
            Editorial Standards
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Every submission undergoes rigorous peer review and editorial
            moderation before publication.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Browse View
 */
export const BrowsePage = () => {
  const categories = [
    'All Topics',
    'Science',
    'Technology',
    'Environment',
    'History',
    'Health',
    'Business',
    'Education',
    'Other',
  ];

  const [articles, setArticles] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] =
    React.useState('All Topics');

  const [loading, setLoading] = React.useState(true);

  /*
   * Fetch articles from backend API using search & category query params
   */
  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('lumen_token');

        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) {
          queryParams.append('search', searchQuery.trim());
        }
        if (selectedCategory && selectedCategory !== 'All Topics') {
          queryParams.append('category', selectedCategory);
        }

        const apiBase = import.meta.env.VITE_API_URL || 'https://content-management-system-2-he9n.onrender.com/api';
        const url = `${apiBase}/articles?${queryParams.toString()}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const filteredArticles = articles;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 lg:py-10 space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Browse Articles & Topics
          </h1>

          <p className="text-xs text-stone-500 mt-1">
            Explore essays, research notes, and curated knowledge
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            aria-label="Search articles or topics"
            placeholder="Search articles or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-[#DCE8DF] bg-white py-2 pl-10 pr-4 text-sm text-stone-900 shadow-sm shadow-emerald-950/[0.02] placeholder:text-stone-400 focus:border-[#1D4936] focus:outline-none focus:ring-2 focus:ring-emerald-800/10"
          />

          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Category Pills */}
      <div aria-label="Filter articles by topic" className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            aria-pressed={selectedCategory === cat}
            className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4936] ${
              selectedCategory === cat
                ? 'bg-[#1D4936] text-white shadow-sm'
                : 'border border-[#DCE8DF] bg-white text-stone-700 hover:bg-emerald-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="text-center py-12 text-stone-500">
          Loading articles...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          No articles found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5">

          {filteredArticles.map((article) => (
            <Link
              key={article._id}
              to={`/browse/${article._id}`}
              className="group rounded-2xl border border-[#DCE8DF] bg-white p-5 shadow-sm shadow-emerald-950/[0.03] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4936] sm:p-6"
            >

              {/* Category + Views */}
              <div className="flex items-center justify-between text-xs text-stone-500">

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  {article.category}
                </span>

                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views || 0}
                </span>

              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold leading-snug text-stone-900 transition-colors group-hover:text-emerald-900">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-stone-600">
                {article.description}
              </p>

              {/* Author + Likes */}
              <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-stone-500">

                <span>
                  By {article.author?.name || 'Unknown Author'}
                </span>

                <span className="flex items-center gap-1 text-stone-700 font-medium">
                  <ThumbsUp className="w-3.5 h-3.5 text-stone-400" />
                  {article.likes || 0} likes
                </span>

              </div>

            </Link>
          ))}

        </div>
      )}
    </div>
  );
};

/**
 * Write View (Article Editor)
 */
export const WritePage = () => {
  const { user } = useAuth();

  // Article form state
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('Technology');

  // Loading and message state
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

  /**
   * Submit article
   */
  const handleSubmit = async () => {
    // Validate title
    if (!title.trim()) {
      setMessageType('error');
      setMessage('Please enter an article title.');
      return;
    }

    // Validate content
    if (!content.trim()) {
      setMessageType('error');
      setMessage('Please enter article content.');
      return;
    }

    // Check logged-in user
    if (!user) {
      setMessageType('error');
      setMessage('Please login before submitting an article.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setMessageType('');

      /*
       * Your AuthContext stores the JWT using:
       *
       * localStorage.setItem('lumen_token', newToken)
       */
      const token = localStorage.getItem('lumen_token');

      if (!token) {
        setMessageType('error');
        setMessage('Authentication token not found. Please login again.');
        return;
      }

      /*
       * STEP 1:
       * Create the article.
       */
      const apiBase = import.meta.env.VITE_API_URL || 'https://content-management-system-2-he9n.onrender.com/api';
      const createResponse = await fetch(
        `${apiBase}/articles`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            content: content.trim(),
            category,
            tags: [],
          }),
        }
      );

      const createData = await createResponse.json();

      console.log('Create article response:', createData);

      if (!createResponse.ok) {
        throw new Error(
          createData.message || 'Failed to create article.'
        );
      }

      /*
       * Get article ID.
       */
      const articleId = createData.article?._id;

      if (!articleId) {
        throw new Error(
          'Article was created but no article ID was returned.'
        );
      }

      /*
       * STEP 2:
       * Submit the newly created article for review.
       */
      const submitResponse = await fetch(
        `${apiBase}/articles/${articleId}/submit`,
        {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const submitData = await submitResponse.json();

      console.log('Submit article response:', submitData);

      if (!submitResponse.ok) {
        throw new Error(
          submitData.message ||
            'Failed to submit article for review.'
        );
      }

      /*
       * SUCCESS
       */
      setMessageType('success');
      setMessage(
        'Article submitted successfully for review!'
      );

      // Clear the form
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('Technology');

    } catch (error) {
      console.error('Submit article error:', error);

      setMessageType('error');
      setMessage(
        error.message ||
          'Something went wrong while submitting the article.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Write New Article
          </h1>

          <p className="text-xs text-stone-500">
            Authoring as {user?.name}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-[#1A382B] text-white text-xs font-bold rounded-xl hover:bg-[#11261D] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>

      {/* Success / Error Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm border ${
            messageType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Article Form */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">

        {/* Article Title */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Article Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging headline..."
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl font-serif text-lg text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          />
        </div>

        {/* Short Excerpt */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Short Excerpt
          </label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief summary for previews..."
            className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          >
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="Environment">Environment</option>
            <option value="Health">Health</option>
            <option value="History">History</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Article Content */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Content (Markdown)
          </label>

          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article in Markdown..."
            className="w-full p-4 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white resize-y"
          />
        </div>

      </div>
    </div>
  );
};

/**
 * Admin View (Verification Center)
 */
export const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Admin Verification Center
        </h1>

        <p className="text-xs text-stone-500">
          Review pending submissions and editorial workflows
        </p>
      </div>

      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-stone-900">
          Pending Review Queue
        </h2>

        <div className="divide-y divide-[#F5F2EB] text-xs">
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-stone-900 block">
                The Future of Brain-Computer Interfaces
              </span>

              <span className="text-stone-500">
                Submitted by Priya Mehta ΓÇó 5 min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-semibold hover:bg-emerald-100 transition">
                Approve
              </button>

              <button className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl font-semibold hover:bg-rose-100 transition">
                Request Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
