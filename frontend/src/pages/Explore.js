import React, { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import profileService from "../services/profileService";

const popularDestinations = [
  { id: 1, name: "Bali, Indonesia", type: "International" },
  { id: 2, name: "Paris, France", type: "International" },
  { id: 3, name: "Tokyo, Japan", type: "International" },
  { id: 4, name: "New York, USA", type: "International" },
  { id: 5, name: "Goa, India", type: "Indian" },
  { id: 6, name: "Jaipur, India", type: "Indian" },
  { id: 7, name: "Kerala, India", type: "Indian" }
];

// Sample user data for demonstration
// const sampleUsers = {
//   "Bali, Indonesia": [
//     { id: 1, name: "Sarah Johnson", bio: "Adventure seeker | Travel photographer", profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
//     { id: 2, name: "Alex Chen", bio: "Digital nomad | Beach lover", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" }
//   ],
//   "Paris, France": [
//     { id: 3, name: "Maria Garcia", bio: "Culture enthusiast | Foodie", profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" }
//   ],
//   "Tokyo, Japan": [
//     { id: 4, name: "James Wilson", bio: "Solo traveler | Tech enthusiast", profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" }
//   ],
//   "New York, USA": [
//     { id: 5, name: "Emma Thompson", bio: "City explorer | Coffee lover", profilePic: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop" }
//   ],
//   "Goa, India": [
//     { id: 6, name: "Rahul Sharma", bio: "Beach lover | Party enthusiast", profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" }
//   ],
//   "Jaipur, India": [
//     { id: 7, name: "Priya Patel", bio: "History buff | Culture lover", profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" }
//   ],
//   "Kerala, India": [
//     { id: 8, name: "Vikram Singh", bio: "Nature lover | Ayurveda enthusiast", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" }
//   ]
// };

const Explore = () => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Use either the selected or custom destination
    const destination = selectedDestination || customDestination;
    
    if (!destination) {
      setError("Please select or enter a destination to search");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);
    
    try {
      const searchResults = await profileService.searchByDestination(destination);
      setResults(searchResults || []);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to search for travelers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-heading text-trippiko-accent mb-4">Explore Destinations</h1>
      
      <form onSubmit={handleSearch} className="bg-trippiko-card p-4 rounded-lg shadow mb-6">
        <div className="mb-4">
          <label className="block text-trippiko-light mb-2">Select a destination:</label>
          <select 
            value={selectedDestination} 
            onChange={(e) => {
              setSelectedDestination(e.target.value);
              if (e.target.value) setCustomDestination("");
            }}
            className="p-2 rounded bg-trippiko-light w-full mb-4"
          >
            <option value="">Select a destination...</option>
            <optgroup label="International Destinations">
              {popularDestinations
                .filter(dest => dest.type === "International")
                .map(dest => (
                  <option key={dest.id} value={dest.name}>{dest.name}</option>
                ))
              }
            </optgroup>
            <optgroup label="Indian Destinations">
              {popularDestinations
                .filter(dest => dest.type === "Indian")
                .map(dest => (
                  <option key={dest.id} value={dest.name}>{dest.name}</option>
                ))
              }
            </optgroup>
          </select>
          
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-trippiko-light"></div>
            <span className="mx-4 text-trippiko-light">OR</span>
            <div className="flex-grow border-t border-trippiko-light"></div>
          </div>
          
          <label className="block text-trippiko-light mb-2">Enter a custom destination:</label>
          <input 
            type="text"
            value={customDestination}
            onChange={(e) => {
              setCustomDestination(e.target.value);
              if (e.target.value) setSelectedDestination("");
            }}
            placeholder="E.g., 'London', 'Beach', 'Mountain'"
            className="p-2 rounded bg-trippiko-light w-full"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || (!selectedDestination && !customDestination)}
          className={`w-full bg-trippiko-accent text-trippiko-dark px-4 py-2 rounded ${
            loading || (!selectedDestination && !customDestination) ? 'opacity-75 cursor-not-allowed' : 'hover:bg-opacity-90'
          } transition-all`}
        >
          {loading ? 'Searching...' : 'Find Travelers'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-trippiko-light">Searching for travelers...</p>
        </div>
      ) : searched ? (
        <>
          <h2 className="text-xl font-bold text-trippiko-accent mb-4">
            {results.length > 0 
              ? `Travelers interested in ${selectedDestination || customDestination}` 
              : `No travelers found for ${selectedDestination || customDestination}`}
          </h2>
          
          {results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((profile) => (
                <SearchResultCard 
                  key={profile.userId || profile._id || profile.id} 
                  profile={profile} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-trippiko-card rounded-lg">
              <p className="text-trippiko-light">No travelers found for this destination.</p>
              <p className="text-trippiko-light mt-2">Try another destination or be the first to add this to your travel plans!</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-trippiko-card rounded-lg">
          <p className="text-trippiko-light">Search for a destination to find fellow travelers.</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
