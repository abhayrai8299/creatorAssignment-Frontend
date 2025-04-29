import { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await axios.get(`${BASE_URL}/feed`);
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);
  return (
    <div className="min-h-screen bg-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Feed</h2>

        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading feed...</div>
        ) : (
          <div className="h-[600px] overflow-y-scroll">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {posts.map((post, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{post.source}</p>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Post →
                    </a>
                  </div>
                  <div className="px-4 py-3 bg-gray-100 flex space-x-2">
                    <button
                      onClick={() => saveFeedItem(post)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(post.url)}
                      className="bg-yellow-400 text-white px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => reportFeedItem(post)}
                      className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
