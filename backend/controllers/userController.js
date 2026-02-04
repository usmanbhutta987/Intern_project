import Post from '../models/Post.js';

const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalPosts = await Post.countDocuments({ author: userId });
    const publishedPosts = await Post.countDocuments({ 
      author: userId, 
      isActive: true 
    });
    const draftPosts = await Post.countDocuments({ 
      author: userId, 
      isActive: false 
    });

    res.json({
      success: true,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = { author: userId };
    
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getUserStats, getMyPosts };