// GET /api/user/
import User from "../models/user.model.js";

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("role recentSearchedCities");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      role: user.role,
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Store user recent searched cities
export const storeSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;

    if (!recentSearchedCity) {
      return res.status(400).json({ success: false, message: "City is required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Avoid duplicates: remove if already exists
    user.recentSearchedCities = user.recentSearchedCities.filter(
      (city) => city.toLowerCase() !== recentSearchedCity.toLowerCase()
    );

    // ✅ Maintain max 3
    if (user.recentSearchedCities.length >= 3) {
      user.recentSearchedCities.shift();
    }

    user.recentSearchedCities.push(recentSearchedCity);

    await user.save();

    res.json({
      success: true,
      message: "Recent searched city stored successfully",
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
